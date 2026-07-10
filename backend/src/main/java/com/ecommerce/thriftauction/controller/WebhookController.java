package com.ecommerce.thriftauction.controller;

import com.ecommerce.thriftauction.entity.Order;
import com.ecommerce.thriftauction.entity.OrderStatus;
import com.ecommerce.thriftauction.repository.OrderRepository;
import com.ecommerce.thriftauction.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final OrderRepository orderRepository;
    private final NotificationService notificationService;

    @PostMapping("/ghn")
    public ResponseEntity<String> handleGhnWebhook(@RequestBody Map<String, Object> payload) {
        try {
            System.out.println("Received GHN Webhook: " + payload);

            String orderCode = (String) payload.get("OrderCode");
            String status = (String) payload.get("Status");

            if (orderCode == null || status == null) {
                return ResponseEntity.badRequest().body("Missing OrderCode or Status");
            }

            // Find order by tracking code
            orderRepository.findByTrackingCode(orderCode).ifPresent(order -> {
                OrderStatus oldStatus = order.getStatus();

                // Map GHN status to our OrderStatus
                switch (status) {
                    case "ready_to_pick":
                    case "picking":
                    case "picked":
                    case "delivering":
                        order.setStatus(OrderStatus.SHIPPED);
                        break;
                    case "delivered":
                        order.setStatus(OrderStatus.DELIVERED);
                        break;
                    case "cancel":
                        order.setStatus(OrderStatus.CANCELED);
                        break;
                }

                if (oldStatus != order.getStatus()) {
                    orderRepository.save(order);

                    // Notify buyer
                    String message = "Đơn hàng của bạn đang được giao.";
                    if (order.getStatus() == OrderStatus.DELIVERED) {
                        message = "Đơn hàng của bạn đã được giao thành công!";
                    } else if (order.getStatus() == OrderStatus.CANCELED) {
                        message = "Đơn hàng của bạn đã bị hủy bởi đơn vị vận chuyển.";
                    }

                    notificationService.createAndSendNotification(
                            order.getBuyer(),
                            "Cập nhật trạng thái vận chuyển",
                            message + " Mã vận đơn: " + orderCode,
                            com.ecommerce.thriftauction.entity.NotificationType.SYSTEM,
                            order.getId());
                }
            });

            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error processing webhook");
        }
    }
}
