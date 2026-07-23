package com.ecommerce.thriftauction.features.voucher.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherValidationRequest {
    private String voucherCode;
    private String productId;
    private Integer quantity;
}
