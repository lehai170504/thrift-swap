package com.ecommerce.thriftauction.features.order.dto;

import com.ecommerce.thriftauction.features.order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private String id;
    private String productId;
    private String productTitle;
    private String productImageUrl;
    private String buyerName;
    private String sellerName;
    private BigDecimal totalAmount;
    private Integer quantity;
    private OrderStatus status;
    private String trackingCode;
    private String disputeReason;
    @com.fasterxml.jackson.annotation.JsonProperty("isReviewed")
    private boolean isReviewed;
    private Integer reviewRating;
    private String reviewComment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
