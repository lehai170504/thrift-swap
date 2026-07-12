package com.ecommerce.thriftauction.features.order.service;

import com.ecommerce.thriftauction.features.order.repository.OrderRepository;
import com.ecommerce.thriftauction.features.product.repository.ProductRepository;
import com.ecommerce.thriftauction.features.payment.repository.WalletRepository;
import com.ecommerce.thriftauction.features.payment.repository.TransactionRepository;
import com.ecommerce.thriftauction.features.auth.repository.UserRepository;
import com.ecommerce.thriftauction.features.auction.repository.AuctionBidRepository;
import com.ecommerce.thriftauction.features.auction.repository.AuctionSessionRepository;
import com.ecommerce.thriftauction.features.notification.service.NotificationService;
import com.ecommerce.thriftauction.features.order.repository.ReviewRepository;
import com.ecommerce.thriftauction.features.voucher.repository.VoucherRepository;
import com.ecommerce.thriftauction.features.voucher.repository.VoucherUsageRepository;
import com.ecommerce.thriftauction.features.order.entity.Order;
import com.ecommerce.thriftauction.features.order.entity.Review;
import com.ecommerce.thriftauction.features.auth.entity.User;
import com.ecommerce.thriftauction.features.product.entity.Product;
import com.ecommerce.thriftauction.features.product.entity.SellType;
import com.ecommerce.thriftauction.features.product.entity.ProductStatus;
import com.ecommerce.thriftauction.features.voucher.entity.Voucher;
import com.ecommerce.thriftauction.features.voucher.entity.VoucherType;
import com.ecommerce.thriftauction.features.payment.entity.Wallet;
import com.ecommerce.thriftauction.features.order.entity.OrderStatus;
import com.ecommerce.thriftauction.features.voucher.entity.VoucherUsage;
import com.ecommerce.thriftauction.features.payment.entity.Transaction;
import com.ecommerce.thriftauction.features.payment.entity.TransactionType;
import com.ecommerce.thriftauction.features.payment.entity.TransactionStatus;
import com.ecommerce.thriftauction.features.notification.entity.NotificationType;
import com.ecommerce.thriftauction.features.auction.entity.AuctionStatus;
import com.ecommerce.thriftauction.features.auction.entity.AuctionBid;
import com.ecommerce.thriftauction.features.order.dto.OrderResponse;
import com.ecommerce.thriftauction.features.auth.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
        private final com.ecommerce.thriftauction.features.auction.repository.AuctionDepositRepository auctionDepositRepository;
        private final NotificationService notificationService;
        private final ReviewRepository reviewRepository;
        private final VoucherRepository voucherRepository;
        private final VoucherUsageRepository voucherUsageRepository;
        private final GhnLogisticsService ghnLogisticsService;

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
                                .platformFee(order.getPlatformFee())
                                .quantity(order.getQuantity() != null ? order.getQuantity() : 1)
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

        private void refundDeposits(com.ecommerce.thriftauction.features.auction.entity.AuctionSession session,
                        Product product) {
                java.util.List<com.ecommerce.thriftauction.features.auction.entity.AuctionDeposit> deposits = auctionDepositRepository
                                .findByAuctionSessionIdAndIsRefundedFalse(session.getId());
                for (com.ecommerce.thriftauction.features.auction.entity.AuctionDeposit d : deposits) {
                        walletRepository.findByUserId(d.getUser().getId()).ifPresent(w -> {
                                w.setHeldBalance(w.getHeldBalance().subtract(d.getAmount()));
                                w.setBalance(w.getBalance().add(d.getAmount()));
                                walletRepository.save(w);

                                Transaction tx = Transaction.builder()
                                                .wallet(w)
                                                .amount(d.getAmount())
                                                .type(TransactionType.AUCTION_REFUND)
                                                .status(TransactionStatus.COMPLETED)
                                                .description("Hoàn cọc đấu giá: " + product.getTitle())
                                                .build();
                                transactionRepository.save(tx);

                                d.setRefunded(true);
                                auctionDepositRepository.save(d);
                        });
                }
        }

        @Transactional
        public OrderResponse createBuyNowOrder(String productId, String voucherCode, Integer requestedQuantity,
                        String buyerUsername) {
                User buyer = userRepository.findByEmail(buyerUsername)
                                .or(() -> userRepository.findByUsername(buyerUsername))
                                .orElseThrow(() -> new RuntimeException("Buyer not found"));
                Product product = productRepository.findByIdForUpdate(productId)
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                if (product.getSellType() != SellType.BUY_NOW || product.getStatus() != ProductStatus.ACTIVE) {
                        throw new RuntimeException("Product is not available for Buy Now");
                }

                int productQuantity = product.getQuantity() != null ? product.getQuantity() : 1;
                if (productQuantity < requestedQuantity) {
                        throw new RuntimeException("Product quantity is not enough");
                }

                BigDecimal totalProductPrice = product.getPrice().multiply(new BigDecimal(requestedQuantity));
                BigDecimal finalPrice = totalProductPrice;
                BigDecimal discount = BigDecimal.ZERO;
                Voucher appliedVoucher = null;

                if (voucherCode != null && !voucherCode.trim().isEmpty()) {
                        appliedVoucher = voucherRepository.findByCodeAndIsActiveTrueForUpdate(voucherCode.trim())
                                        .orElseThrow(() -> new RuntimeException("Voucher not found or inactive"));

                        // Validation
                        if (appliedVoucher.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
                                throw new RuntimeException("Voucher is expired");
                        }
                        if (appliedVoucher.getQuantity() <= 0) {
                                throw new RuntimeException("Voucher is out of stock");
                        }
                        if (appliedVoucher.getMinOrderValue() != null
                                        && totalProductPrice.compareTo(appliedVoucher.getMinOrderValue()) < 0) {
                                throw new RuntimeException("Order value is not enough to apply this voucher");
                        }
                        if (appliedVoucher.getSeller() != null
                                        && !appliedVoucher.getSeller().getId().equals(product.getSeller().getId())) {
                                throw new RuntimeException("Voucher is not applicable for this shop");
                        }

                        // Check usage
                        long usageCount = voucherUsageRepository.countByVoucherIdAndUserId(appliedVoucher.getId(),
                                        buyer.getId());
                        if (usageCount >= appliedVoucher.getUsageLimitPerUser()) {
                                throw new RuntimeException("You have reached the usage limit for this voucher");
                        }

                        // Calculate discount
                        if (appliedVoucher.getType() == VoucherType.FIXED_AMOUNT) {
                                discount = appliedVoucher.getDiscountValue();
                        } else if (appliedVoucher.getType() == VoucherType.PERCENTAGE) {
                                discount = totalProductPrice.multiply(appliedVoucher.getDiscountValue())
                                                .divide(new BigDecimal("100"));
                                if (appliedVoucher.getMaxDiscount() != null
                                                && discount.compareTo(appliedVoucher.getMaxDiscount()) > 0) {
                                        discount = appliedVoucher.getMaxDiscount();
                                }
                        } else if (appliedVoucher.getType() == VoucherType.FREE_SHIPPING) {
                                // Currently not supporting shipping fee yet
                                discount = BigDecimal.ZERO;
                        }

                        if (discount.compareTo(finalPrice) > 0) {
                                discount = finalPrice;
                        }

                        finalPrice = finalPrice.subtract(discount);
                }

                Wallet buyerWallet = walletRepository.findByUserId(buyer.getId())
                                .orElseThrow(() -> new RuntimeException("Buyer wallet not found"));

                if (buyerWallet.getBalance().compareTo(finalPrice) < 0) {
                        throw new RuntimeException("Insufficient balance in wallet. Please top up.");
                }

                buyerWallet.setBalance(buyerWallet.getBalance().subtract(finalPrice));
                walletRepository.save(buyerWallet);

                Order order = Order.builder()
                                .buyer(buyer)
                                .seller(product.getSeller())
                                .product(product)
                                .quantity(requestedQuantity)
                                .totalAmount(finalPrice)
                                .appliedVoucher(appliedVoucher)
                                .discountAmount(discount)
                                .status(OrderStatus.PAID)
                                .logisticsProvider("GHN")
                                .build();
                orderRepository.save(order);

                // Call GHN API to create shipping order
                java.util.Map<String, Object> ghnResult = ghnLogisticsService.createShippingOrder(order);
                if (ghnResult != null) {
                        order.setTrackingCode((String) ghnResult.get("trackingCode"));
                        order.setShippingFee((BigDecimal) ghnResult.get("shippingFee"));
                        orderRepository.save(order);
                }

                if (appliedVoucher != null) {
                        appliedVoucher.setQuantity(appliedVoucher.getQuantity() - 1);
                        voucherRepository.save(appliedVoucher);

                        VoucherUsage usage = VoucherUsage.builder()
                                        .voucher(appliedVoucher)
                                        .user(buyer)
                                        .order(order)
                                        .build();
                        voucherUsageRepository.save(usage);
                }

                Transaction tx = Transaction.builder()
                                .wallet(buyerWallet)
                                .order(order)
                                .amount(finalPrice)
                                .type(TransactionType.ESCROW_HOLD)
                                .status(TransactionStatus.COMPLETED)
                                .description("Tạm giữ (Ký quỹ) cho đơn hàng #"
                                                + order.getId().substring(0, 8).toUpperCase() + " - "
                                                + product.getTitle())
                                .build();
                transactionRepository.save(tx);

                int newQuantity = productQuantity - requestedQuantity;
                product.setQuantity(newQuantity);
                if (newQuantity <= 0) {
                        product.setStatus(ProductStatus.SOLD);
                }
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

                if (order.getStatus() != OrderStatus.PAID && order.getStatus() != OrderStatus.SHIPPED
                                && order.getStatus() != OrderStatus.DELIVERED) {
                        throw new RuntimeException("Invalid order status to confirm receipt");
                }

                order.setStatus(OrderStatus.COMPLETED);

                // Calculate Platform Fee based on Seller Tier
                BigDecimal feePercentage = new BigDecimal("0.05"); // Default 5%
                if (order.getSeller().getTier() != null) {
                        switch (order.getSeller().getTier()) {
                                case DIAMOND:
                                        feePercentage = new BigDecimal("0.02");
                                        break; // 2%
                                case GOLD:
                                        feePercentage = new BigDecimal("0.03");
                                        break; // 3%
                                case SILVER:
                                        feePercentage = new BigDecimal("0.04");
                                        break; // 4%
                                default:
                                        feePercentage = new BigDecimal("0.05");
                                        break; // 5%
                        }
                }

                BigDecimal totalOrderAmount = order.getTotalAmount();
                BigDecimal platformFee = totalOrderAmount.multiply(feePercentage);
                BigDecimal sellerEarnings = totalOrderAmount.subtract(platformFee);

                order.setPlatformFee(platformFee);
                orderRepository.save(order);

                // Update points for Gamification
                updateUserPoints(order.getBuyer(), totalOrderAmount);
                updateUserPoints(order.getSeller(), totalOrderAmount);

                Wallet sellerWallet = walletRepository.findByUserId(order.getSeller().getId())
                                .orElseThrow(() -> new RuntimeException("Seller wallet not found"));

                sellerWallet.setBalance(sellerWallet.getBalance().add(sellerEarnings));
                walletRepository.save(sellerWallet);

                Transaction sellerTx = Transaction.builder()
                                .wallet(sellerWallet)
                                .order(order)
                                .amount(sellerEarnings)
                                .type(TransactionType.ESCROW_RELEASE)
                                .status(TransactionStatus.COMPLETED)
                                .description("Thanh toán đơn hàng #" + order.getId().substring(0, 8).toUpperCase()
                                                + " - " + order.getProduct().getTitle() + " (Đã trừ phí sàn "
                                                + feePercentage.multiply(new BigDecimal("100")).intValue() + "%: "
                                                + platformFee + "đ)")
                                .build();
                transactionRepository.save(sellerTx);

                // Transfer fee to admin wallet
                var adminUsers = userRepository.findByRole(Role.ADMIN);
                if (!adminUsers.isEmpty() && platformFee.compareTo(BigDecimal.ZERO) > 0) {
                        User adminUser = adminUsers.get(0);
                        Wallet adminWallet = walletRepository.findByUserId(adminUser.getId())
                                        .orElseThrow(() -> new RuntimeException("Admin wallet not found"));
                        adminWallet.setBalance(adminWallet.getBalance().add(platformFee));
                        walletRepository.save(adminWallet);

                        Transaction adminTx = Transaction.builder()
                                        .wallet(adminWallet)
                                        .order(order)
                                        .amount(platformFee)
                                        .type(TransactionType.ESCROW_RELEASE)
                                        .status(TransactionStatus.COMPLETED)
                                        .description("Phí sàn ("
                                                        + feePercentage.multiply(new BigDecimal("100")).intValue()
                                                        + "%) từ đơn hàng #"
                                                        + order.getId().substring(0, 8).toUpperCase() + " - "
                                                        + order.getProduct().getTitle())
                                        .build();
                        transactionRepository.save(adminTx);
                }

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
                        refundDeposits(session, product);
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

                refundDeposits(session, product);

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
                                .description("Tạm giữ (Ký quỹ) cho đơn hàng #"
                                                + order.getId().substring(0, 8).toUpperCase() + " - "
                                                + order.getProduct().getTitle())
                                .build();
                transactionRepository.save(tx);

                order.setStatus(OrderStatus.PAID);
                order.setLogisticsProvider("GHN");
                Order savedOrder = orderRepository.save(order);

                // Call GHN API to create shipping order
                java.util.Map<String, Object> ghnResult = ghnLogisticsService.createShippingOrder(savedOrder);
                if (ghnResult != null) {
                        savedOrder.setTrackingCode((String) ghnResult.get("trackingCode"));
                        savedOrder.setShippingFee((BigDecimal) ghnResult.get("shippingFee"));
                        orderRepository.save(savedOrder);
                }

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

                if (order.getStatus() != OrderStatus.PAID && order.getStatus() != OrderStatus.SHIPPED
                                && order.getStatus() != OrderStatus.DELIVERED) {
                        throw new RuntimeException(
                                        "Chỉ có thể khiếu nại khi đơn hàng đã thanh toán, đang giao hoặc đã giao hàng.");
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
                                        .description("Hoàn trả ký quỹ cho đơn hàng #"
                                                        + order.getId().substring(0, 8).toUpperCase() + " - "
                                                        + order.getProduct().getTitle())
                                        .build();
                        transactionRepository.save(tx);

                        order.setStatus(OrderStatus.CANCELED);

                        Product product = order.getProduct();
                        int currentQty = product.getQuantity() != null ? product.getQuantity() : 0;
                        product.setQuantity(currentQty + order.getQuantity());
                        product.setStatus(ProductStatus.ACTIVE);
                        productRepository.save(product);

                        // Refund voucher if applied
                        if (order.getAppliedVoucher() != null) {
                                Voucher appliedVoucher = order.getAppliedVoucher();
                                appliedVoucher.setQuantity(appliedVoucher.getQuantity() + 1);
                                voucherRepository.save(appliedVoucher);

                                voucherUsageRepository.deleteByOrderId(order.getId());
                        }

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

                        BigDecimal totalOrderAmount = order.getTotalAmount();
                        BigDecimal platformFee = totalOrderAmount.multiply(new BigDecimal("0.05"));
                        BigDecimal sellerEarnings = totalOrderAmount.subtract(platformFee);

                        order.setPlatformFee(platformFee);

                        sellerWallet.setBalance(sellerWallet.getBalance().add(sellerEarnings));
                        walletRepository.save(sellerWallet);

                        Transaction tx = Transaction.builder()
                                        .wallet(sellerWallet)
                                        .order(order)
                                        .amount(sellerEarnings)
                                        .type(TransactionType.ESCROW_RELEASE)
                                        .status(TransactionStatus.COMPLETED)
                                        .description("Thanh toán đơn hàng (Thắng khiếu nại) #"
                                                        + order.getId().substring(0, 8).toUpperCase() + " - "
                                                        + order.getProduct().getTitle() + " (Đã trừ phí sàn 5%: "
                                                        + platformFee + "đ)")
                                        .build();
                        transactionRepository.save(tx);

                        // Transfer fee to admin wallet
                        var adminUsers = userRepository.findByRole(Role.ADMIN);
                        if (!adminUsers.isEmpty() && platformFee.compareTo(BigDecimal.ZERO) > 0) {
                                User adminUser = adminUsers.get(0);
                                Wallet adminWallet = walletRepository.findByUserId(adminUser.getId())
                                                .orElseThrow(() -> new RuntimeException("Admin wallet not found"));
                                adminWallet.setBalance(adminWallet.getBalance().add(platformFee));
                                walletRepository.save(adminWallet);

                                Transaction adminTx = Transaction.builder()
                                                .wallet(adminWallet)
                                                .order(order)
                                                .amount(platformFee)
                                                .type(TransactionType.ESCROW_RELEASE)
                                                .status(TransactionStatus.COMPLETED)
                                                .description("Phí sàn (5%) từ khiếu nại đơn hàng #"
                                                                + order.getId().substring(0, 8).toUpperCase() + " - "
                                                                + order.getProduct().getTitle())
                                                .build();
                                transactionRepository.save(adminTx);
                        }

                        order.setStatus(OrderStatus.COMPLETED);

                        // Update points for Gamification
                        updateUserPoints(order.getBuyer(), totalOrderAmount);
                        updateUserPoints(order.getSeller(), totalOrderAmount);

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

        @Transactional(readOnly = true)
        public com.ecommerce.thriftauction.features.order.dto.SellerAnalyticsResponse getSellerAnalytics(
                        String username) {
                User user = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Order> sellerOrders = orderRepository.findBySellerId(user.getId());

                long totalOrders = sellerOrders.size();
                long pendingOrders = sellerOrders.stream()
                                .filter(o -> o.getStatus() == OrderStatus.PENDING_PAYMENT
                                                || o.getStatus() == OrderStatus.PAID)
                                .count();
                long completedOrders = sellerOrders.stream()
                                .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                                .count();
                long canceledOrders = sellerOrders.stream()
                                .filter(o -> o.getStatus() == OrderStatus.CANCELED)
                                .count();

                // Calculate Revenue (only from COMPLETED orders, subtract platform fee)
                BigDecimal totalRevenue = sellerOrders.stream()
                                .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                                .map(o -> {
                                        BigDecimal amount = o.getTotalAmount() != null ? o.getTotalAmount()
                                                        : BigDecimal.ZERO;
                                        BigDecimal fee = o.getPlatformFee() != null ? o.getPlatformFee()
                                                        : BigDecimal.ZERO;
                                        return amount.subtract(fee);
                                })
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Group revenue by date (last 30 days)
                java.time.LocalDateTime thirtyDaysAgo = java.time.LocalDateTime.now().minusDays(30);

                java.util.Map<String, BigDecimal> dailyRevMap = sellerOrders.stream()
                                .filter(o -> o.getStatus() == OrderStatus.COMPLETED && o.getCreatedAt() != null
                                                && o.getCreatedAt().isAfter(thirtyDaysAgo))
                                .collect(Collectors.groupingBy(
                                                o -> o.getCreatedAt()
                                                                .format(java.time.format.DateTimeFormatter
                                                                                .ofPattern("yyyy-MM-dd")),
                                                Collectors.reducing(
                                                                BigDecimal.ZERO,
                                                                o -> {
                                                                        BigDecimal amount = o.getTotalAmount() != null
                                                                                        ? o.getTotalAmount()
                                                                                        : BigDecimal.ZERO;
                                                                        BigDecimal fee = o.getPlatformFee() != null
                                                                                        ? o.getPlatformFee()
                                                                                        : BigDecimal.ZERO;
                                                                        return amount.subtract(fee);
                                                                },
                                                                BigDecimal::add)));

                // Generate 30 days list to fill gaps
                List<com.ecommerce.thriftauction.features.order.dto.SellerAnalyticsResponse.DailyRevenue> chart = new java.util.ArrayList<>();
                for (int i = 29; i >= 0; i--) {
                        String date = java.time.LocalDateTime.now().minusDays(i)
                                        .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                        chart.add(com.ecommerce.thriftauction.features.order.dto.SellerAnalyticsResponse.DailyRevenue
                                        .builder()
                                        .date(date)
                                        .revenue(dailyRevMap.getOrDefault(date, BigDecimal.ZERO))
                                        .build());
                }

                return com.ecommerce.thriftauction.features.order.dto.SellerAnalyticsResponse.builder()
                                .totalRevenue(totalRevenue)
                                .totalOrders(totalOrders)
                                .pendingOrders(pendingOrders)
                                .completedOrders(completedOrders)
                                .canceledOrders(canceledOrders)
                                .revenueChart(chart)
                                .build();
        }

        private void updateUserPoints(User user, BigDecimal amount) {
                if (user == null || amount == null || amount.compareTo(BigDecimal.ZERO) <= 0)
                        return;

                BigDecimal newPoints = user.getTotalPoints().add(amount);
                user.setTotalPoints(newPoints);

                com.ecommerce.thriftauction.features.auth.entity.UserTier newTier = com.ecommerce.thriftauction.features.auth.entity.UserTier.BRONZE;
                if (newPoints.compareTo(new BigDecimal("50000000")) >= 0) {
                        newTier = com.ecommerce.thriftauction.features.auth.entity.UserTier.DIAMOND;
                } else if (newPoints.compareTo(new BigDecimal("20000000")) >= 0) {
                        newTier = com.ecommerce.thriftauction.features.auth.entity.UserTier.GOLD;
                } else if (newPoints.compareTo(new BigDecimal("5000000")) >= 0) {
                        newTier = com.ecommerce.thriftauction.features.auth.entity.UserTier.SILVER;
                }

                user.setTier(newTier);
                userRepository.save(user);
        }
}
