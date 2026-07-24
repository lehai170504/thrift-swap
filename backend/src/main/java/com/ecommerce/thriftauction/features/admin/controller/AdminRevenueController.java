package com.ecommerce.thriftauction.features.admin.controller;

import com.ecommerce.thriftauction.features.admin.dto.RevenueStatsResponse;
import com.ecommerce.thriftauction.features.admin.service.AdminRevenueService;
import com.ecommerce.thriftauction.features.payment.entity.Transaction;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/revenue")
@RequiredArgsConstructor
@Tag(name = "Admin Revenue Ledger", description = "Admin quản lý doanh thu sàn (hoa hồng, phí rút tiền)")
public class AdminRevenueController {

    private final AdminRevenueService adminRevenueService;

    @Operation(summary = "Lấy tổng quan doanh thu", description = "Admin xem tổng tiền thu được từ hoa hồng và phí rút")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RevenueStatsResponse> getRevenueStats() {
        return ResponseEntity.ok(adminRevenueService.getRevenueStats());
    }

    @Operation(summary = "Lấy danh sách giao dịch doanh thu", description = "Lịch sử các giao dịch cộng tiền vào doanh thu sàn")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Transaction>> getRevenueTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminRevenueService.getRevenueTransactions(PageRequest.of(page, size)));
    }
}
