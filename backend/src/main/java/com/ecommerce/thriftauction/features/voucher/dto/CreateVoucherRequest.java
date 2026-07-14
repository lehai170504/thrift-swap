package com.ecommerce.thriftauction.features.voucher.dto;

import com.ecommerce.thriftauction.features.voucher.entity.VoucherType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateVoucherRequest {

    @NotBlank(message = "Voucher code is required")
    private String code;

    @NotNull(message = "Voucher type is required")
    private VoucherType type;

    @NotNull(message = "Discount value is required")
    private BigDecimal discountValue;

    private BigDecimal minOrderValue;

    private BigDecimal maxDiscount;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    @NotNull(message = "Expiry date is required")
    private LocalDateTime expiryDate;

    private Integer usageLimitPerUser;
}
