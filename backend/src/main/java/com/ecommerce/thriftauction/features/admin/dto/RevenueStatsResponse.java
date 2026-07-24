package com.ecommerce.thriftauction.features.admin.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class RevenueStatsResponse {
    private BigDecimal totalRevenue;
    private BigDecimal totalCommission;
    private BigDecimal totalWithdrawalFees;

    // Additional granular stats can be added here
}
