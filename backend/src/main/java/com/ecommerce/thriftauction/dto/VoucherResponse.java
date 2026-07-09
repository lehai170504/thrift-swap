package com.ecommerce.thriftauction.dto;

import com.ecommerce.thriftauction.entity.VoucherType;
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
