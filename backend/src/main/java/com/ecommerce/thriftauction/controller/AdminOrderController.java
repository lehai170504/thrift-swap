package com.ecommerce.thriftauction.controller;

import com.ecommerce.thriftauction.dto.OrderResponse;
import com.ecommerce.thriftauction.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
@Tag(name = "Admin Orders", description = "Quản lý đơn hàng dành cho Admin (yêu cầu quyền ADMIN)")
public class AdminOrderController {

    private final OrderService orderService;

    @Operation(summary = "Lấy tất cả đơn hàng", description = "Admin xem toàn bộ đơn hàng trong hệ thống (có phân trang).")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.getAllOrders(search, pageable));
    }

    @Operation(summary = "Lấy đơn hàng bị khiếu nại", description = "Admin xem các đơn hàng đang ở trạng thái DISPUTED.")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/disputed")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponse>> getDisputedOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.getAllDisputedOrders(search, pageable));
    }

    @Operation(summary = "Phán quyết khiếu nại", description = "Admin xử lý khiếu nại. Winner là 'BUYER' (hoàn tiền) hoặc 'SELLER' (chuyển tiền cho người bán).")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Xử lý thành công"),
            @ApiResponse(responseCode = "400", description = "Lỗi dữ liệu (Order không tồn tại hoặc không ở trạng thái DISPUTED)")
    })
    @PostMapping("/{orderId}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resolveDispute(@PathVariable String orderId, @RequestBody Map<String, String> body) {
        try {
            String winner = body.get("winner"); // "BUYER" or "SELLER"
            return ResponseEntity.ok(orderService.resolveDispute(orderId, winner));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
