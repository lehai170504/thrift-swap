package com.ecommerce.thriftauction.features.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WalletResponse {
    private String id;
    private BigDecimal balance;
    private BigDecimal heldBalance;
    private List<TransactionResponse> recentTransactions;
}
