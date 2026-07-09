package com.ecommerce.thriftauction.controller;

import com.ecommerce.thriftauction.service.VoucherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import com.ecommerce.thriftauction.dto.CreateVoucherRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vouchers")
@RequiredArgsConstructor
@Tag(name = "Vouchers", description = "Quản lý mã giảm giá")
public class VoucherController {

    private final VoucherService voucherService;

    @Operation(summary = "Lấy mã giảm giá khả dụng", description = "Lấy danh sách mã giảm giá của sàn và của shop.")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/available")
    public ResponseEntity<?> getAvailableVouchers(@RequestParam(required = false) String sellerId) {
        return ResponseEntity.ok(voucherService.getAvailableVouchers(sellerId));
    }

    @Operation(summary = "Lấy mã giảm giá của shop", description = "Dành cho người bán lấy danh sách mã do mình tạo.")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/my-vouchers")
    public ResponseEntity<?> getMyVouchers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String sellerId = authentication.getName();
        return ResponseEntity.ok(voucherService.getMyVouchers(sellerId));
    }

    @Operation(summary = "Tạo mã giảm giá", description = "Người bán tạo mã giảm giá mới.")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping
    public ResponseEntity<?> createVoucher(@Valid @RequestBody CreateVoucherRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String sellerId = authentication.getName();
        return ResponseEntity.ok(voucherService.createVoucher(request, sellerId));
    }

    @Operation(summary = "Bật/Tắt mã giảm giá", description = "Người bán bật/tắt mã giảm giá của mình.")
    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleVoucherStatus(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String sellerId = authentication.getName();
        return ResponseEntity.ok(voucherService.toggleVoucherStatus(id, sellerId));
    }

    @Operation(summary = "Lấy lịch sử sử dụng mã giảm giá", description = "Người bán xem danh sách người dùng đã sử dụng mã giảm giá của mình.")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/{id}/usages")
    public ResponseEntity<?> getVoucherUsages(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String sellerId = authentication.getName();
        return ResponseEntity.ok(voucherService.getVoucherUsages(id, sellerId));
    }
}
