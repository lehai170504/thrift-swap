package com.ecommerce.thriftauction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherUsageResponse {
    private String id;
    private String username;
    private String email;
    private String orderId;
    private String productTitle;
    private BigDecimal discountAmount;
    private LocalDateTime usedAt;
}
