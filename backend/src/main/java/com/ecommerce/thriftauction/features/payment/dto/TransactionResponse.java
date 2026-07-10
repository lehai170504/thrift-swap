package com.ecommerce.thriftauction.features.payment.dto;

import com.ecommerce.thriftauction.features.payment.entity.TransactionStatus;
import com.ecommerce.thriftauction.features.payment.entity.TransactionType;
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
public class TransactionResponse {
    private String id;
    private BigDecimal amount;
    private TransactionType type;
    private TransactionStatus status;
    private String description;
    private String username;
    private String walletId;
    private LocalDateTime createdAt;
}
