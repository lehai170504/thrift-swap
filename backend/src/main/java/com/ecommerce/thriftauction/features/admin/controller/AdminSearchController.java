package com.ecommerce.thriftauction.features.admin.controller;

import com.ecommerce.thriftauction.features.admin.dto.GlobalSearchResult;
import com.ecommerce.thriftauction.features.admin.service.AdminSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/search")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Search", description = "Tìm kiếm tổng hợp toàn hệ thống dành cho Admin")
public class AdminSearchController {

    private final AdminSearchService searchService;

    @Operation(summary = "Tìm kiếm tổng hợp", description = "Tìm theo Order ID, Tên người dùng, Email, hoặc Tên sản phẩm.")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping
    public ResponseEntity<GlobalSearchResult> globalSearch(@RequestParam("q") String query) {
        return ResponseEntity.ok(searchService.search(query));
    }
}
