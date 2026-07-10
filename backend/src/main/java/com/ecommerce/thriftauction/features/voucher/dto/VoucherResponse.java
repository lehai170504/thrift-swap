package com.ecommerce.thriftauction.features.voucher.dto;

import com.ecommerce.thriftauction.features.voucher.entity.VoucherType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class VoucherResponse {
    private String id;
    private String code;
    private VoucherType type;
    private BigDecimal discountValue;
    private BigDecimal minOrderValue;
    private BigDecimal maxDiscount;
    private Integer quantity;
    private LocalDateTime expiryDate;
    private String sellerId;
    private boolean isActive;
}
