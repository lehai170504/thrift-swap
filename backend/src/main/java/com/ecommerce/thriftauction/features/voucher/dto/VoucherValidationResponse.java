package com.ecommerce.thriftauction.features.voucher.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherValidationResponse {
    private BigDecimal totalProductPrice;
    private BigDecimal shippingFee;
    private BigDecimal productDiscount;
    private BigDecimal shippingDiscount;
    private BigDecimal finalPrice;
    private String message;
}
