package com.ecommerce.thriftauction.controller;

import com.ecommerce.thriftauction.dto.ProductResponse;
import com.ecommerce.thriftauction.service.AdminProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Products", description = "Quản lý toàn bộ sản phẩm")
public class AdminProductController {
    private final AdminProductService adminProductService;

    @Operation(summary = "Lấy toàn bộ sản phẩm")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminProductService.getAllProducts(search, PageRequest.of(page, size)));
    }

    @Operation(summary = "Xóa sản phẩm vi phạm")
    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        adminProductService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}
