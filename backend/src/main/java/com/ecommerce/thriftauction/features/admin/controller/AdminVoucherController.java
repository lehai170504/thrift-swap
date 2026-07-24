package com.ecommerce.thriftauction.features.admin.controller;

import com.ecommerce.thriftauction.features.voucher.service.VoucherService;
import com.ecommerce.thriftauction.features.voucher.dto.CreateVoucherRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin/vouchers")
@RequiredArgsConstructor
@Tag(name = "Admin Vouchers", description = "Admin/Staff quản lý mã giảm giá của sàn")
public class AdminVoucherController {

    private final VoucherService voucherService;

    @Operation(summary = "Lấy tất cả voucher của sàn", description = "Admin lấy danh sách voucher do sàn phát hành.")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> getAllPlatformVouchers() {
        return ResponseEntity.ok(voucherService.getAllPlatformVouchersAdmin());
    }

    @Operation(summary = "Tạo voucher của sàn", description = "Admin tạo mã giảm giá toàn sàn.")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> createPlatformVoucher(@Valid @RequestBody CreateVoucherRequest request) {
        return ResponseEntity.ok(voucherService.createVoucher(request, null));
    }

    @Operation(summary = "Bật/Tắt voucher của sàn", description = "Admin bật hoặc tắt voucher.")
    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> togglePlatformVoucherStatus(@PathVariable String id) {
        return ResponseEntity.ok(voucherService.togglePlatformVoucherStatus(id));
    }

    @Operation(summary = "Xóa voucher của sàn", description = "Admin xóa voucher.")
    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> deletePlatformVoucher(@PathVariable String id) {
        voucherService.deletePlatformVoucher(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Lấy lịch sử sử dụng voucher", description = "Admin xem lịch sử ai đã dùng voucher này.")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/{id}/usages")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> getPlatformVoucherUsages(@PathVariable String id) {
        return ResponseEntity.ok(voucherService.getPlatformVoucherUsages(id));
    }
}
