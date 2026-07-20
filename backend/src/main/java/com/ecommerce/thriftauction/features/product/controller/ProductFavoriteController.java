package com.ecommerce.thriftauction.features.product.controller;

import com.ecommerce.thriftauction.features.product.service.ProductFavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.ecommerce.thriftauction.features.product.dto.ProductResponse;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductFavoriteController {

    private final ProductFavoriteService favoriteService;

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Map<String, Boolean>> toggleFavorite(@PathVariable String id, Authentication authentication) {
        boolean isFavorited = favoriteService.toggleFavorite(id, authentication.getName());
        return ResponseEntity.ok(Map.of("isFavorited", isFavorited));
    }

    @GetMapping("/favorites/ids")
    public ResponseEntity<List<String>> getUserFavoriteIds(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }
        List<String> favoriteIds = favoriteService.getUserFavoriteProductIds(authentication.getName());
        return ResponseEntity.ok(favoriteIds);
    }

    @GetMapping("/favorites")
    public ResponseEntity<Page<ProductResponse>> getUserFavorites(Authentication authentication, Pageable pageable) {
        if (authentication == null) {
            return ResponseEntity.ok(Page.empty());
        }
        return ResponseEntity.ok(favoriteService.getUserFavoriteProducts(authentication.getName(), pageable));
    }
}
