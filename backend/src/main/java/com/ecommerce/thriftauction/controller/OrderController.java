package com.ecommerce.thriftauction.controller;

import com.ecommerce.thriftauction.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Quản lý đơn hàng mua/bán, thanh toán Escrow, và khiếu nại")
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "Tạo đơn Mua Ngay", description = "Người mua bấm mua ngay một sản phẩm.")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/buy-now/{productId}")
    public ResponseEntity<?> createBuyNowOrder(@PathVariable String productId, Authentication authentication) {
        try {
            return ResponseEntity.ok(orderService.createBuyNowOrder(productId, authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Đơn mua của tôi", description = "Danh sách các đơn hàng mà user hiện tại đã mua.")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/me")
    public ResponseEntity<?> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.getMyOrders(authentication.getName(), pageable));
    }

    @Operation(summary = "Đơn bán của tôi", description = "Danh sách các đơn hàng mà user hiện tại đang bán.")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/sales")
    public ResponseEntity<?> getMySales(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.getMySales(authentication.getName(), pageable));
    }

    @Operation(summary = "Thanh toán (Escrow Hold)", description = "Chuyển tiền từ Ví Người Mua vào quỹ Tạm Giữ.")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/{orderId}/pay")
    public ResponseEntity<?> payOrder(@PathVariable String orderId, Authentication authentication) {
        try {
            return ResponseEntity.ok(orderService.payOrder(authentication.getName(), orderId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Xác nhận đã nhận hàng (Escrow Release)", description = "Người mua xác nhận đã nhận hàng. Tiền Tạm Giữ sẽ được chuyển vào ví Người Bán.")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/{orderId}/confirm-receipt")
    public ResponseEntity<?> confirmReceipt(@PathVariable String orderId, Authentication authentication) {
        try {
            orderService.confirmReceiptAndReleaseEscrow(orderId, authentication.getName());
            return ResponseEntity.ok("Receipt confirmed and money released to seller.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Khiếu nại đơn hàng", description = "Người mua khiếu nại nếu hàng lỗi hoặc không đúng mô tả.")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/{orderId}/dispute")
    public ResponseEntity<?> disputeOrder(@PathVariable String orderId,
            @RequestBody(required = false) java.util.Map<String, String> body, Authentication authentication) {
        try {
            String reason = body != null ? body.get("reason") : null;
            return ResponseEntity.ok(orderService.disputeOrder(orderId, authentication.getName(), reason));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Cập nhật mã vận đơn", description = "Người bán cập nhật mã vận đơn khi đã giao cho đơn vị vận chuyển.")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/{orderId}/ship")
    public ResponseEntity<?> shipOrder(@PathVariable String orderId, @RequestBody java.util.Map<String, String> body,
            Authentication authentication) {
        try {
            String trackingCode = body.get("trackingCode");
            return ResponseEntity.ok(orderService.shipOrder(orderId, authentication.getName(), trackingCode));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
