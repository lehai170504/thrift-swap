package com.ecommerce.thriftauction.service;

import com.ecommerce.thriftauction.dto.ProductResponse;
import com.ecommerce.thriftauction.entity.Product;
import com.ecommerce.thriftauction.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(String search, Pageable pageable) {
        Page<Product> products;
        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.findByTitleContainingIgnoreCase(search.trim(), pageable);
        } else {
            products = productRepository.findAll(pageable);
        }

        return products.map(p -> ProductResponse.builder()
                .id(p.getId())
                .sellerId(p.getSeller().getId())
                .sellerName(p.getSeller().getUsername())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .title(p.getTitle())
                .description(p.getDescription())
                .condition(p.getCondition())
                .sellType(p.getSellType())
                .price(p.getPrice())
                .status(p.getStatus())
                .imageUrl(p.getImageUrl())
                .createdAt(p.getCreatedAt())
                .build());
    }

    @Transactional
    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }
}
