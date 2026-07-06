package com.ecommerce.thriftauction.controller;

import com.ecommerce.thriftauction.dto.ChartDataResponse;
import com.ecommerce.thriftauction.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Dashboard", description = "Dashboard Thống kê (Yêu cầu quyền ADMIN)")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @Operation(summary = "Lấy dữ liệu biểu đồ", description = "Lấy doanh thu và số đơn hàng 6 tháng gần nhất.")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/chart")
    public ResponseEntity<List<ChartDataResponse>> getChartData() {
        return ResponseEntity.ok(adminDashboardService.get6MonthChartData());
    }
}
