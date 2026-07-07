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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
                                .imageUrl(request.getImageUrl())
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

        public Page<ProductResponse> searchProducts(String query, String categoryId, Double minPrice, Double maxPrice,
                        ProductCondition condition, SellType sellType, Pageable pageable) {

                BigDecimal min = minPrice != null ? BigDecimal.valueOf(minPrice) : null;
                BigDecimal max = maxPrice != null ? BigDecimal.valueOf(maxPrice) : null;

                return productRepository.searchProducts(
                                query == null || query.trim().isEmpty() ? null : query.trim(),
                                categoryId == null || categoryId.trim().isEmpty() ? null : categoryId,
                                min, max, condition, sellType, pageable).map(this::mapToResponse);
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

                if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
                        product.setImageUrl(request.getImageUrl());
                }

                // Only allow updating price if it's BUY_NOW or if AUCTION hasn't started with
                // bids (handled above)
                product.setPrice(request.getPrice());

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

        private ProductResponse mapToResponse(Product product) {
                java.time.LocalDateTime auctionEndTime = null;
                if (product.getSellType() == SellType.AUCTION) {
                        auctionEndTime = auctionSessionRepository.findByProductId(product.getId())
                                        .map(com.ecommerce.thriftauction.entity.AuctionSession::getEndTime)
                                        .orElse(null);
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
                                .imageUrl(product.getImageUrl())
                                .status(product.getStatus())
                                .createdAt(product.getCreatedAt())
                                .auctionEndTime(auctionEndTime)
                                .build();
        }
}
