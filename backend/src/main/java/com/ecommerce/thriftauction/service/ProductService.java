package com.ecommerce.thriftauction.service;

import com.ecommerce.thriftauction.dto.ProductRequest;
import com.ecommerce.thriftauction.dto.ProductResponse;
import com.ecommerce.thriftauction.entity.Category;
import com.ecommerce.thriftauction.entity.Product;
import com.ecommerce.thriftauction.entity.ProductStatus;
import com.ecommerce.thriftauction.entity.ProductCondition;
import com.ecommerce.thriftauction.entity.SellType;
import com.ecommerce.thriftauction.entity.User;
import com.ecommerce.thriftauction.repository.CategoryRepository;
import com.ecommerce.thriftauction.repository.ProductRepository;
import com.ecommerce.thriftauction.repository.UserRepository;
import com.ecommerce.thriftauction.repository.WalletRepository;
import com.ecommerce.thriftauction.repository.TransactionRepository;
import com.ecommerce.thriftauction.entity.Wallet;
import com.ecommerce.thriftauction.entity.Transaction;
import com.ecommerce.thriftauction.entity.TransactionType;
import com.ecommerce.thriftauction.entity.TransactionStatus;
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
        private final com.ecommerce.thriftauction.repository.AuctionSessionRepository auctionSessionRepository;

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
                        com.ecommerce.thriftauction.entity.AuctionSession session = com.ecommerce.thriftauction.entity.AuctionSession
                                        .builder()
                                        .product(product)
                                        .startTime(java.time.LocalDateTime.now())
                                        .endTime(java.time.LocalDateTime.now().plusDays(durationDays))
                                        .startingPrice(request.getPrice())
                                        .stepPrice(new BigDecimal("50000")) // Default step 50k
                                        .currentHighestPrice(request.getPrice())
                                        .status(com.ecommerce.thriftauction.entity.AuctionStatus.ONGOING)
                                        .build();
                        auctionSessionRepository.save(session);
                }

                return mapToResponse(product);
        }

        public Page<ProductResponse> getAllActiveProducts(Pageable pageable) {
                return productRepository.findByStatus(ProductStatus.ACTIVE, pageable)
                                .map(this::mapToResponse);
        }

        public ProductResponse getProductById(String id) {
                Product product = productRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Product not found"));
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

        public List<ProductResponse> getProductsBySeller(String username) {
                User seller = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return productRepository.findBySellerId(seller.getId()).stream()
                                .filter(p -> p.getStatus() == ProductStatus.ACTIVE)
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
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
                        com.ecommerce.thriftauction.entity.AuctionSession session = auctionSessionRepository
                                        .findByProductId(product.getId())
                                        .orElse(null);

                        if (session != null
                                        && session.getCurrentHighestPrice().compareTo(session.getStartingPrice()) > 0) {
                                throw new RuntimeException("Cannot delete auction because it already has bids");
                        }

                        if (session != null) {
                                session.setStatus(com.ecommerce.thriftauction.entity.AuctionStatus.CANCELED);
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
                        com.ecommerce.thriftauction.entity.AuctionSession session = auctionSessionRepository
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
                        com.ecommerce.thriftauction.entity.AuctionSession session = auctionSessionRepository
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
                userRepository.findByRole(com.ecommerce.thriftauction.entity.Role.ADMIN).stream().findFirst()
                                .ifPresent(admin -> {
                                        Wallet adminWallet = walletRepository.findByUserId(admin.getId()).orElse(null);
                                        if (adminWallet != null) {
                                                adminWallet.setBalance(adminWallet.getBalance().add(boostFee));
                                                walletRepository.save(adminWallet);
                                        }
                                });

                return mapToResponse(product);
        }

        private ProductResponse mapToResponse(Product product) {
                java.time.LocalDateTime auctionEndTime = null;
                BigDecimal currentHighestBid = null;
                if (product.getSellType() == SellType.AUCTION) {
                        var sessionOpt = auctionSessionRepository.findByProductId(product.getId());
                        if (sessionOpt.isPresent()) {
                                auctionEndTime = sessionOpt.get().getEndTime();
                                currentHighestBid = sessionOpt.get().getCurrentHighestPrice();
                        }
                }

                return ProductResponse.builder()
                                .id(product.getId())
                                .sellerId(product.getSeller().getId())
                                .sellerName(product.getSeller().getUsername())
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
                                .build();
        }
}
