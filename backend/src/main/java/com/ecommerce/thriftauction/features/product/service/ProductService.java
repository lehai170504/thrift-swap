package com.ecommerce.thriftauction.features.product.service;

import com.ecommerce.thriftauction.features.notification.service.NotificationService;
import com.ecommerce.thriftauction.features.product.dto.ProductRequest;
import com.ecommerce.thriftauction.features.product.dto.ProductResponse;
import com.ecommerce.thriftauction.features.product.entity.Category;
import com.ecommerce.thriftauction.features.product.entity.Product;
import com.ecommerce.thriftauction.features.product.entity.ProductStatus;
import com.ecommerce.thriftauction.features.product.entity.ProductCondition;
import com.ecommerce.thriftauction.features.product.entity.SellType;
import com.ecommerce.thriftauction.features.auth.entity.User;
import com.ecommerce.thriftauction.features.product.repository.CategoryRepository;
import com.ecommerce.thriftauction.features.product.repository.ProductRepository;
import com.ecommerce.thriftauction.features.auth.repository.UserRepository;
import com.ecommerce.thriftauction.features.payment.repository.WalletRepository;
import com.ecommerce.thriftauction.features.payment.repository.TransactionRepository;
import com.ecommerce.thriftauction.features.payment.entity.Wallet;
import com.ecommerce.thriftauction.features.payment.entity.Transaction;
import com.ecommerce.thriftauction.features.payment.entity.TransactionType;
import com.ecommerce.thriftauction.features.payment.entity.TransactionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

        private final ProductRepository productRepository;
        private final CategoryRepository categoryRepository;
        private final UserRepository userRepository;
        private final WalletRepository walletRepository;
        private final TransactionRepository transactionRepository;
        private final com.ecommerce.thriftauction.features.auction.repository.AuctionSessionRepository auctionSessionRepository;
        private final com.ecommerce.thriftauction.features.auction.repository.AuctionBidRepository auctionBidRepository;
        private final com.ecommerce.thriftauction.features.social.repository.FollowRepository followRepository;
        private final com.ecommerce.thriftauction.features.product.repository.ProductViewHistoryRepository productViewHistoryRepository;
        private final NotificationService notificationService;
        private final com.ecommerce.thriftauction.features.ai.service.AiService aiService;

        public ProductResponse createProduct(ProductRequest request, String username) {
                User seller = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new RuntimeException("Category not found"));

                Product product = Product.builder()
                                .seller(seller)
                                .category(category)
                                .title(request.getTitle())
                                .description(request.getDescription())
                                .condition(request.getCondition())
                                .sellType(request.getSellType())
                                .price(request.getPrice())
                                .quantity(request.getQuantity() != null ? request.getQuantity() : 1)
                                .imageUrl(request.getImageUrl())
                                .videoUrl(request.getVideoUrl())
                                .location(request.getLocation())
                                .status(ProductStatus.ACTIVE)
                                .build();

                product = productRepository.save(product);

                if (request.getSellType() == SellType.AUCTION) {
                        int durationDays = request.getAuctionDurationDays() != null ? request.getAuctionDurationDays()
                                        : 3;
                        com.ecommerce.thriftauction.features.auction.entity.AuctionSession session = com.ecommerce.thriftauction.features.auction.entity.AuctionSession
                                        .builder()
                                        .product(product)
                                        .startTime(java.time.LocalDateTime.now())
                                        .endTime(java.time.LocalDateTime.now().plusDays(durationDays))
                                        .startingPrice(request.getPrice())
                                        .stepPrice(new BigDecimal("50000")) // Default step 50k
                                        .currentHighestPrice(request.getPrice())
                                        .status(com.ecommerce.thriftauction.features.auction.entity.AuctionStatus.ONGOING)
                                        .build();
                        auctionSessionRepository.save(session);
                }

                // Notify followers
                final Product savedProduct = product;
                java.util.List<com.ecommerce.thriftauction.features.social.entity.Follow> followers = followRepository
                                .findAll()
                                .stream()
                                .filter(f -> f.getFollowing().getId().equals(seller.getId()))
                                .toList();

                for (com.ecommerce.thriftauction.features.social.entity.Follow f : followers) {
                        notificationService.createAndSendNotification(
                                        f.getFollower(),
                                        "Gian hàng bạn theo dõi",
                                        seller.getFullName() + " vừa đăng bán sản phẩm: " + savedProduct.getTitle(),
                                        com.ecommerce.thriftauction.features.notification.entity.NotificationType.SYSTEM,
                                        savedProduct.getId());
                }

                return mapToResponse(product);
        }

        public Page<ProductResponse> getAllActiveProducts(Pageable pageable) {
                return productRepository.findByStatus(ProductStatus.ACTIVE, pageable)
                                .map(this::mapToResponse);
        }

        public ProductResponse getProductById(String id, String username, boolean consentGranted) {
                Product product = productRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                if (username != null && consentGranted) {
                        userRepository.findByEmail(username).or(() -> userRepository.findByUsername(username))
                                        .ifPresent(user -> {
                                                productViewHistoryRepository
                                                                .findByUserIdAndProductId(user.getId(), product.getId())
                                                                .ifPresentOrElse(history -> {
                                                                        history.setViewedAt(
                                                                                        java.time.LocalDateTime.now());
                                                                        productViewHistoryRepository.save(history);
                                                                        System.out.println(
                                                                                        "[Cookie Consent ACCEPTED] Da cap nhat lich su xem san pham: "
                                                                                                        + product.getTitle()
                                                                                                        + " cho user: "
                                                                                                        + username);
                                                                }, () -> {
                                                                        productViewHistoryRepository.save(
                                                                                        com.ecommerce.thriftauction.features.product.entity.ProductViewHistory
                                                                                                        .builder()
                                                                                                        .user(user)
                                                                                                        .product(product)
                                                                                                        .build());
                                                                        System.out.println(
                                                                                        "[Cookie Consent ACCEPTED] Da luu moi lich su xem san pham: "
                                                                                                        + product.getTitle()
                                                                                                        + " cho user: "
                                                                                                        + username);
                                                                });
                                        });
                } else if (username != null) {
                        System.out.println(
                                        "[Cookie Consent DECLINED/MISSING] Khong luu lich su xem san pham de bao ve quyen rieng tu cho user: "
                                                        + username);
                }

                return mapToResponse(product);
        }

        public Page<ProductResponse> searchProducts(String query, List<String> categoryIds, Double minPrice,
                        Double maxPrice,
                        ProductCondition condition, SellType sellType, String location, Pageable pageable) {

                BigDecimal min = minPrice != null ? BigDecimal.valueOf(minPrice) : null;
                BigDecimal max = maxPrice != null ? BigDecimal.valueOf(maxPrice) : null;

                return productRepository.searchProducts(
                                query == null || query.trim().isEmpty() ? null : query.trim(),
                                categoryIds,
                                min, max, condition, sellType, location, pageable).map(this::mapToResponse);
        }

        public List<ProductResponse> getRelatedProducts(String categoryId, String excludeId) {
                return productRepository.findRelatedProducts(categoryId, excludeId).stream()
                                .limit(4)
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        public List<ProductResponse> getRecommendations(String username) {
                User user = userRepository.findByEmail(username).or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<com.ecommerce.thriftauction.features.product.entity.ProductViewHistory> history = productViewHistoryRepository
                                .findByUserIdOrderByViewedAtDesc(user.getId())
                                .stream().limit(10).collect(Collectors.toList());

                if (history.isEmpty()) {
                        return productRepository
                                        .findByStatus(ProductStatus.ACTIVE,
                                                        org.springframework.data.domain.PageRequest.of(0, 8))
                                        .stream()
                                        .map(this::mapToResponse).collect(Collectors.toList());
                }

                List<String> viewedProductIds = history.stream().map(h -> h.getProduct().getId())
                                .collect(Collectors.toList());

                List<String> historyTitles = history.stream()
                                .map(h -> h.getProduct().getTitle() + " (" + h.getProduct().getCategory().getName()
                                                + ")")
                                .collect(Collectors.toList());

                // Fetch 30 random/recent active products that the user hasn't viewed yet
                List<Product> availableProducts = productRepository
                                .findByStatus(ProductStatus.ACTIVE,
                                                org.springframework.data.domain.PageRequest.of(0, 40))
                                .stream()
                                .filter(p -> !viewedProductIds.contains(p.getId()))
                                .limit(30)
                                .collect(Collectors.toList());

                if (availableProducts.isEmpty()) {
                        return java.util.Collections.emptyList();
                }

                StringBuilder availableProductsList = new StringBuilder();
                for (Product p : availableProducts) {
                        availableProductsList.append(p.getId()).append(" | ")
                                        .append(p.getTitle()).append(" | ")
                                        .append(p.getCategory().getName()).append("\n");
                }

                try {
                        String recommendedIdsStr = aiService.recommendProductsFromList(historyTitles,
                                        availableProductsList.toString());
                        if (recommendedIdsStr != null && !recommendedIdsStr.isEmpty()) {
                                String[] recommendedIds = recommendedIdsStr.split(",");
                                List<Product> recommendedProducts = availableProducts.stream()
                                                .filter(p -> java.util.Arrays.asList(recommendedIds)
                                                                .contains(p.getId()))
                                                .collect(Collectors.toList());

                                if (!recommendedProducts.isEmpty()) {
                                        return recommendedProducts.stream().map(this::mapToResponse)
                                                        .collect(Collectors.toList());
                                }
                        }
                } catch (Exception e) {
                        System.err.println("Lỗi gọi AI Recommend: " + e.getMessage());
                }

                // Fallback to random/first 8 if AI fails or returns empty
                return availableProducts.stream().limit(8).map(this::mapToResponse).collect(Collectors.toList());
        }

        public List<ProductResponse> getProductsBySeller(String username) {
                User seller = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return productRepository.findBySellerId(seller.getId()).stream()
                                .filter(p -> p.getStatus() != ProductStatus.DELETED)
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Transactional
        public ProductResponse restartAuction(String id, String username) {
                Product product = productRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                User currentUser = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!product.getSeller().getId().equals(currentUser.getId())) {
                        throw new RuntimeException("You are not authorized to modify this product");
                }

                if (product.getSellType() != SellType.AUCTION) {
                        throw new RuntimeException("Only auction products can be restarted");
                }

                if (product.getStatus() != ProductStatus.HIDDEN) {
                        throw new RuntimeException("Product is not in a restartable state");
                }

                com.ecommerce.thriftauction.features.auction.entity.AuctionSession session = auctionSessionRepository
                                .findByProductId(product.getId())
                                .orElseThrow(() -> new RuntimeException("Auction session not found"));

                // Reset session
                session.setStatus(com.ecommerce.thriftauction.features.auction.entity.AuctionStatus.ONGOING);
                session.setStartTime(java.time.LocalDateTime.now());
                session.setEndTime(java.time.LocalDateTime.now().plusDays(7));
                session.setCurrentHighestPrice(session.getStartingPrice()); // Reset highest price to starting price
                auctionSessionRepository.save(session);

                // Set product active
                product.setStatus(ProductStatus.ACTIVE);
                product = productRepository.save(product);

                return mapToResponse(product);
        }

        public void deleteProduct(String id, String username) {
                Product product = productRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                User currentUser = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!product.getSeller().getId().equals(currentUser.getId())) {
                        throw new RuntimeException("You are not authorized to delete this product");
                }

                if (product.getSellType() == SellType.AUCTION) {
                        com.ecommerce.thriftauction.features.auction.entity.AuctionSession session = auctionSessionRepository
                                        .findByProductId(product.getId())
                                        .orElse(null);

                        if (session != null
                                        && session.getCurrentHighestPrice().compareTo(session.getStartingPrice()) > 0) {
                                throw new RuntimeException("Cannot delete auction because it already has bids");
                        }

                        if (session != null) {
                                session.setStatus(
                                                com.ecommerce.thriftauction.features.auction.entity.AuctionStatus.CANCELED);
                                auctionSessionRepository.save(session);
                        }
                }

                product.setStatus(ProductStatus.HIDDEN);
                productRepository.save(product);
        }

        public ProductResponse updateProduct(String id, ProductRequest request, String username) {
                Product product = productRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                User currentUser = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!product.getSeller().getId().equals(currentUser.getId())) {
                        throw new RuntimeException("You are not authorized to update this product");
                }

                if (product.getSellType() == SellType.AUCTION) {
                        com.ecommerce.thriftauction.features.auction.entity.AuctionSession session = auctionSessionRepository
                                        .findByProductId(product.getId())
                                        .orElse(null);

                        if (session != null
                                        && session.getCurrentHighestPrice().compareTo(session.getStartingPrice()) > 0) {
                                throw new RuntimeException("Cannot update auction because it already has bids");
                        }
                }

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new RuntimeException("Category not found"));

                product.setTitle(request.getTitle());
                product.setDescription(request.getDescription());
                product.setCondition(request.getCondition());
                product.setCategory(category);
                product.setLocation(request.getLocation());

                if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
                        product.setImageUrl(request.getImageUrl());
                }
                if (request.getVideoUrl() != null && !request.getVideoUrl().isEmpty()) {
                        product.setVideoUrl(request.getVideoUrl());
                }

                // Only allow updating price if it's BUY_NOW or if AUCTION hasn't started with
                // bids (handled above)
                product.setPrice(request.getPrice());
                product.setQuantity(request.getQuantity());

                product = productRepository.save(product);

                // If it's an auction and we updated the price, we also need to update the
                // starting price of the session
                if (product.getSellType() == SellType.AUCTION) {
                        com.ecommerce.thriftauction.features.auction.entity.AuctionSession session = auctionSessionRepository
                                        .findByProductId(product.getId())
                                        .orElse(null);
                        if (session != null) {
                                session.setStartingPrice(request.getPrice());
                                session.setCurrentHighestPrice(request.getPrice());
                                auctionSessionRepository.save(session);
                        }
                }

                return mapToResponse(product);
        }

        @Transactional
        public ProductResponse boostProduct(String id, String username) {
                Product product = productRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                User currentUser = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!product.getSeller().getId().equals(currentUser.getId())) {
                        throw new RuntimeException("You are not authorized to boost this product");
                }

                Wallet wallet = walletRepository.findByUserId(currentUser.getId())
                                .orElseThrow(() -> new RuntimeException("Wallet not found"));

                BigDecimal boostFee = new BigDecimal("20000"); // 20k per day
                if (wallet.getBalance().compareTo(boostFee) < 0) {
                        throw new RuntimeException("Insufficient balance to boost product. Fee is 20,000 VND.");
                }

                wallet.setBalance(wallet.getBalance().subtract(boostFee));
                walletRepository.save(wallet);

                if (product.getBoostedUntil() == null
                                || product.getBoostedUntil().isBefore(java.time.LocalDateTime.now())) {
                        product.setBoostedUntil(java.time.LocalDateTime.now().plusDays(1));
                } else {
                        product.setBoostedUntil(product.getBoostedUntil().plusDays(1));
                }
                productRepository.save(product);

                Transaction tx = Transaction.builder()
                                .wallet(wallet)
                                .amount(boostFee)
                                .type(TransactionType.BOOST_FEE)
                                .status(TransactionStatus.COMPLETED)
                                .build();
                transactionRepository.save(tx);

                // Transfer fee to admin wallet
                userRepository.findByRole(com.ecommerce.thriftauction.features.auth.entity.Role.ADMIN).stream()
                                .findFirst()
                                .ifPresent(admin -> {
                                        Wallet adminWallet = walletRepository.findByUserId(admin.getId()).orElse(null);
                                        if (adminWallet != null) {
                                                adminWallet.setBalance(adminWallet.getBalance().add(boostFee));
                                                walletRepository.save(adminWallet);
                                        }
                                });

                return mapToResponse(product);
        }

        public ProductResponse mapToResponse(Product product) {
                java.time.LocalDateTime auctionEndTime = null;
                BigDecimal currentHighestBid = null;
                Integer bidCount = 0;

                if (product.getSellType() == SellType.AUCTION) {
                        var sessionOpt = auctionSessionRepository.findByProductId(product.getId());
                        if (sessionOpt.isPresent()) {
                                auctionEndTime = sessionOpt.get().getEndTime();
                                currentHighestBid = sessionOpt.get().getCurrentHighestPrice();
                                bidCount = auctionBidRepository.countByAuctionSessionId(sessionOpt.get().getId());
                        }
                }

                return ProductResponse.builder()
                                .id(product.getId())
                                .sellerId(product.getSeller().getId())
                                .sellerName(product.getSeller().getUsername())
                                .sellerAvatar(product.getSeller().getAvatar())
                                .categoryId(product.getCategory().getId())
                                .categoryName(product.getCategory().getName())
                                .title(product.getTitle())
                                .description(product.getDescription())
                                .condition(product.getCondition())
                                .sellType(product.getSellType())
                                .price(product.getPrice())
                                .quantity(product.getQuantity() != null ? product.getQuantity() : 1)
                                .imageUrl(product.getImageUrl())
                                .videoUrl(product.getVideoUrl())
                                .location(product.getLocation())
                                .status(product.getStatus())
                                .createdAt(product.getCreatedAt())
                                .auctionEndTime(auctionEndTime)
                                .boostedUntil(product.getBoostedUntil())
                                .currentHighestBid(currentHighestBid)
                                .bidCount(bidCount)
                                .isLive(product.getIsLive())
                                .averageRating(product.getAverageRating())
                                .soldCount(product.getSoldCount())
                                .build();
        }
}
