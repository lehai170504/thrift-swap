package com.ecommerce.thriftauction.service;

import com.ecommerce.thriftauction.dto.OrderResponse;
import com.ecommerce.thriftauction.entity.*;
import com.ecommerce.thriftauction.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class OrderService {
        private final OrderRepository orderRepository;
        private final ProductRepository productRepository;
        private final WalletRepository walletRepository;
        private final TransactionRepository transactionRepository;
        private final UserRepository userRepository;
        private final AuctionBidRepository auctionBidRepository;
        private final AuctionSessionRepository auctionSessionRepository;
        private final NotificationService notificationService;
        private final ReviewRepository reviewRepository;

        private OrderResponse mapToResponse(Order order) {
                var reviewOpt = reviewRepository.findByOrderId(order.getId());
                return OrderResponse.builder()
                                .id(order.getId())
                                .productId(order.getProduct().getId())
                                .productTitle(order.getProduct().getTitle())
                                .productImageUrl(order.getProduct().getImageUrl())
                                .buyerName(order.getBuyer().getUsername())
                                .sellerName(order.getSeller().getUsername())
                                .totalAmount(order.getTotalAmount())
                                .status(order.getStatus())
                                .trackingCode(order.getTrackingCode())
                                .disputeReason(order.getDisputeReason())
                                .isReviewed(reviewOpt.isPresent())
                                .reviewRating(reviewOpt.map(Review::getRating).orElse(null))
                                .reviewComment(reviewOpt.map(Review::getComment).orElse(null))
                                .createdAt(order.getCreatedAt())
                                .updatedAt(order.getUpdatedAt())
                                .build();
        }

        @Transactional
        public OrderResponse createBuyNowOrder(String productId, String buyerUsername) {
                User buyer = userRepository.findByEmail(buyerUsername)
                                .or(() -> userRepository.findByUsername(buyerUsername))
                                .orElseThrow(() -> new RuntimeException("Buyer not found"));
                Product product = productRepository.findByIdForUpdate(productId)
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                if (product.getSellType() != SellType.BUY_NOW || product.getStatus() != ProductStatus.ACTIVE) {
                        throw new RuntimeException("Product is not available for Buy Now");
                }

                Wallet buyerWallet = walletRepository.findByUserId(buyer.getId())
                                .orElseThrow(() -> new RuntimeException("Buyer wallet not found"));

                if (buyerWallet.getBalance().compareTo(product.getPrice()) < 0) {
                        throw new RuntimeException("Insufficient balance in wallet. Please top up.");
                }

                buyerWallet.setBalance(buyerWallet.getBalance().subtract(product.getPrice()));
                walletRepository.save(buyerWallet);

                Order order = Order.builder()
                                .buyer(buyer)
                                .seller(product.getSeller())
                                .product(product)
                                .totalAmount(product.getPrice())
                                .status(OrderStatus.PAID)
                                .build();
                orderRepository.save(order);

                Transaction tx = Transaction.builder()
                                .wallet(buyerWallet)
                                .order(order)
                                .amount(product.getPrice())
                                .type(TransactionType.ESCROW_HOLD)
                                .status(TransactionStatus.COMPLETED)
                                .build();
                transactionRepository.save(tx);

                product.setStatus(ProductStatus.SOLD);
                productRepository.save(product);

                notificationService.createAndSendNotification(
                                product.getSeller(),
                                "Có người vừa mua sản phẩm của bạn!",
                                "Người dùng " + buyer.getUsername() + " đã mua " + product.getTitle() + " với giá "
                                                + product.getPrice() + "đ.",
                                NotificationType.ORDER_CREATED,
                                order.getId());

                return mapToResponse(order);
        }

        @Transactional(readOnly = true)
        public Page<OrderResponse> getMyOrders(String username, Pageable pageable) {
                User user = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return orderRepository.findByBuyerIdOrderByCreatedAtDesc(user.getId(), pageable)
                                .map(this::mapToResponse);
        }

        @Transactional(readOnly = true)
        public Page<OrderResponse> getMySales(String username, Pageable pageable) {
                User user = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return orderRepository.findBySellerIdOrderByCreatedAtDesc(user.getId(), pageable)
                                .map(this::mapToResponse);
        }

        @Transactional
        public void confirmReceiptAndReleaseEscrow(String orderId, String buyerUsername) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                if (!order.getBuyer().getEmail().equals(buyerUsername)
                                && !order.getBuyer().getUsername().equals(buyerUsername)) {
                        throw new RuntimeException("Only buyer can confirm receipt");
                }

                if (order.getStatus() != OrderStatus.PAID && order.getStatus() != OrderStatus.SHIPPED) {
                        throw new RuntimeException("Invalid order status to confirm receipt");
                }

                order.setStatus(OrderStatus.COMPLETED);
                orderRepository.save(order);

                Wallet sellerWallet = walletRepository.findByUserId(order.getSeller().getId())
                                .orElseThrow(() -> new RuntimeException("Seller wallet not found"));

                sellerWallet.setBalance(sellerWallet.getBalance().add(order.getTotalAmount()));
                walletRepository.save(sellerWallet);

                Transaction tx = Transaction.builder()
                                .wallet(sellerWallet)
                                .order(order)
                                .amount(order.getTotalAmount())
                                .type(TransactionType.ESCROW_RELEASE)
                                .status(TransactionStatus.COMPLETED)
                                .build();
                transactionRepository.save(tx);

                notificationService.createAndSendNotification(
                                order.getSeller(),
                                "Tiền đã được chuyển vào ví!",
                                "Người mua đã xác nhận nhận hàng cho đơn " + order.getProduct().getTitle()
                                                + ". Tiền Escrow đã được chuyển vào ví của bạn.",
                                NotificationType.ESCROW_RELEASED,
                                order.getId());
        }

        @Transactional
        public OrderResponse endAuctionAndCreateOrder(String productId) {
                Product product = productRepository.findByIdForUpdate(productId)
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                var existingOrder = orderRepository.findByProductId(productId);
                if (existingOrder.isPresent()) {
                        return mapToResponse(existingOrder.get());
                }

                var session = auctionSessionRepository.findByProductId(productId)
                                .orElseThrow(() -> new RuntimeException("Auction session not found"));

                var bids = auctionBidRepository.findByAuctionSessionIdOrderByBidAmountDesc(session.getId());
                if (bids.isEmpty()) {
                        product.setStatus(ProductStatus.ACTIVE);
                        productRepository.save(product);
                        session.setStatus(AuctionStatus.ENDED);
                        auctionSessionRepository.save(session);
                        throw new RuntimeException("No bids on this auction");
                }

                AuctionBid highestBid = bids.get(0);
                User buyer = highestBid.getBidder();
                User seller = product.getSeller();

                Order order = Order.builder()
                                .product(product)
                                .buyer(buyer)
                                .seller(seller)
                                .totalAmount(highestBid.getBidAmount())
                                .status(OrderStatus.PENDING_PAYMENT)
                                .build();

                Order savedOrder = orderRepository.save(order);

                product.setStatus(ProductStatus.SOLD);
                productRepository.save(product);

                session.setStatus(AuctionStatus.ENDED);
                auctionSessionRepository.save(session);

                notificationService.createAndSendNotification(
                                buyer,
                                "Chúc mừng! Bạn đã thắng đấu giá",
                                "Bạn đã thắng đấu giá sản phẩm " + product.getTitle() + " với giá "
                                                + highestBid.getBidAmount() + "đ. Vui lòng thanh toán đơn hàng.",
                                NotificationType.AUCTION_WON,
                                savedOrder.getId());

                notificationService.createAndSendNotification(
                                seller,
                                "Sản phẩm đấu giá đã kết thúc!",
                                "Người dùng " + buyer.getUsername() + " đã thắng đấu giá " + product.getTitle()
                                                + " với giá " + highestBid.getBidAmount() + "đ.",
                                NotificationType.ORDER_CREATED,
                                savedOrder.getId());

                return mapToResponse(savedOrder);
        }

        @Transactional
        public OrderResponse payOrder(String username, String orderId) {
                User user = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                if (!order.getBuyer().getId().equals(user.getId())) {
                        throw new RuntimeException("Not your order");
                }

                if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
                        throw new RuntimeException("Order is not pending payment");
                }

                Wallet wallet = walletRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Wallet not found"));

                if (wallet.getBalance().compareTo(order.getTotalAmount()) < 0) {
                        throw new RuntimeException("Số dư không đủ để thanh toán");
                }

                wallet.setBalance(wallet.getBalance().subtract(order.getTotalAmount()));
                wallet.setHeldBalance(wallet.getHeldBalance().add(order.getTotalAmount()));
                walletRepository.save(wallet);

                Transaction tx = Transaction.builder()
                                .wallet(wallet)
                                .order(order)
                                .amount(order.getTotalAmount())
                                .type(TransactionType.ESCROW_HOLD)
                                .status(TransactionStatus.COMPLETED)
                                .build();
                transactionRepository.save(tx);

                order.setStatus(OrderStatus.PAID);
                Order savedOrder = orderRepository.save(order);

                notificationService.createAndSendNotification(
                                order.getSeller(),
                                "Đơn hàng đã được thanh toán Escrow!",
                                "Người mua đã thanh toán cho đơn hàng " + order.getProduct().getTitle()
                                                + ". Tiền đang được hệ thống tạm giữ. Vui lòng giao hàng.",
                                NotificationType.ORDER_PAID,
                                order.getId());

                return mapToResponse(savedOrder);
        }

        @Transactional
        public OrderResponse disputeOrder(String orderId, String username, String reason) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                if (!order.getBuyer().getEmail().equals(username) && !order.getBuyer().getUsername().equals(username)) {
                        throw new RuntimeException("Chỉ người mua mới có quyền khiếu nại.");
                }

                if (order.getStatus() != OrderStatus.PAID && order.getStatus() != OrderStatus.SHIPPED) {
                        throw new RuntimeException("Chỉ có thể khiếu nại khi đơn hàng đã thanh toán hoặc đang giao.");
                }

                order.setStatus(OrderStatus.DISPUTED);
                order.setDisputeReason(reason);
                Order savedOrder = orderRepository.save(order);

                notificationService.createAndSendNotification(
                                order.getSeller(),
                                "Đơn hàng bị khiếu nại!",
                                "Người mua " + username + " đã khiếu nại đơn hàng " + order.getProduct().getTitle()
                                                + ". Vui lòng kiểm tra lại.",
                                NotificationType.ORDER_DISPUTED,
                                order.getId());

                return mapToResponse(savedOrder);
        }

        @Transactional
        public OrderResponse shipOrder(String orderId, String username, String trackingCode) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                if (!order.getSeller().getEmail().equals(username)
                                && !order.getSeller().getUsername().equals(username)) {
                        throw new RuntimeException("Chỉ người bán mới có quyền cập nhật vận đơn.");
                }

                if (order.getStatus() != OrderStatus.PAID) {
                        throw new RuntimeException("Đơn hàng chưa được thanh toán hoặc đã giao.");
                }

                order.setStatus(OrderStatus.SHIPPED);
                order.setTrackingCode(trackingCode);
                Order savedOrder = orderRepository.save(order);

                notificationService.createAndSendNotification(
                                order.getBuyer(),
                                "Đơn hàng đã được giao!",
                                "Người bán đã giao hàng cho đơn " + order.getProduct().getTitle() + ". Mã vận đơn: "
                                                + trackingCode,
                                NotificationType.ORDER_SHIPPED,
                                order.getId());

                return mapToResponse(savedOrder);
        }

        @Transactional(readOnly = true)
        public Page<OrderResponse> getAllOrders(String search, Pageable pageable) {
                if (search != null && !search.trim().isEmpty()) {
                        return orderRepository.searchAllOrders(search.trim(), pageable).map(this::mapToResponse);
                }
                return orderRepository.findAll(pageable)
                                .map(this::mapToResponse);
        }

        @Transactional(readOnly = true)
        public Page<OrderResponse> getAllDisputedOrders(String search, Pageable pageable) {
                if (search != null && !search.trim().isEmpty()) {
                        return orderRepository.findByStatusAndSearch(OrderStatus.DISPUTED, search.trim(), pageable)
                                        .map(this::mapToResponse);
                }
                return orderRepository.findByStatusOrderByCreatedAtDesc(OrderStatus.DISPUTED, pageable)
                                .map(this::mapToResponse);
        }

        @Transactional
        public OrderResponse resolveDispute(String orderId, String winner) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                if (order.getStatus() != OrderStatus.DISPUTED) {
                        throw new RuntimeException("Order is not in DISPUTED status");
                }

                if ("BUYER".equalsIgnoreCase(winner)) {
                        // Buyer wins -> Refund escrow to buyer
                        Wallet buyerWallet = walletRepository.findByUserId(order.getBuyer().getId())
                                        .orElseThrow(() -> new RuntimeException("Buyer wallet not found"));

                        buyerWallet.setBalance(buyerWallet.getBalance().add(order.getTotalAmount()));
                        walletRepository.save(buyerWallet);

                        Transaction tx = Transaction.builder()
                                        .wallet(buyerWallet)
                                        .order(order)
                                        .amount(order.getTotalAmount())
                                        .type(TransactionType.REFUND)
                                        .status(TransactionStatus.COMPLETED)
                                        .build();
                        transactionRepository.save(tx);

                        order.setStatus(OrderStatus.CANCELED);

                        Product product = order.getProduct();
                        product.setStatus(ProductStatus.ACTIVE);
                        productRepository.save(product);

                        notificationService.createAndSendNotification(
                                        order.getBuyer(),
                                        "Khiếu nại thành công!",
                                        "Admin đã xử thắng khiếu nại cho bạn. Tiền " + order.getTotalAmount()
                                                        + "đ đã được hoàn vào ví.",
                                        NotificationType.ORDER_DISPUTED,
                                        order.getId());

                        notificationService.createAndSendNotification(
                                        order.getSeller(),
                                        "Khiếu nại thất bại",
                                        "Admin đã xử thắng cho người mua. Bạn sẽ không nhận được tiền từ đơn hàng "
                                                        + order.getProduct().getTitle(),
                                        NotificationType.ORDER_DISPUTED,
                                        order.getId());

                } else if ("SELLER".equalsIgnoreCase(winner)) {
                        // Seller wins -> Release escrow to seller
                        Wallet sellerWallet = walletRepository.findByUserId(order.getSeller().getId())
                                        .orElseThrow(() -> new RuntimeException("Seller wallet not found"));

                        sellerWallet.setBalance(sellerWallet.getBalance().add(order.getTotalAmount()));
                        walletRepository.save(sellerWallet);

                        Transaction tx = Transaction.builder()
                                        .wallet(sellerWallet)
                                        .order(order)
                                        .amount(order.getTotalAmount())
                                        .type(TransactionType.ESCROW_RELEASE)
                                        .status(TransactionStatus.COMPLETED)
                                        .build();
                        transactionRepository.save(tx);

                        order.setStatus(OrderStatus.COMPLETED);

                        notificationService.createAndSendNotification(
                                        order.getSeller(),
                                        "Khiếu nại thành công!",
                                        "Admin đã xử thắng khiếu nại cho bạn. Tiền " + order.getTotalAmount()
                                                        + "đ đã được chuyển vào ví.",
                                        NotificationType.ESCROW_RELEASED,
                                        order.getId());

                        notificationService.createAndSendNotification(
                                        order.getBuyer(),
                                        "Khiếu nại thất bại",
                                        "Admin đã xử thắng cho người bán. Tiền đơn hàng "
                                                        + order.getProduct().getTitle()
                                                        + " đã được chuyển cho người bán.",
                                        NotificationType.ORDER_DISPUTED,
                                        order.getId());

                } else {
                        throw new RuntimeException("Winner must be BUYER or SELLER");
                }

                Order savedOrder = orderRepository.save(order);
                return mapToResponse(savedOrder);
        }
}
