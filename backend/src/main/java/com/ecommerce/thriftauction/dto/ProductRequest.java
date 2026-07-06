package com.ecommerce.thriftauction.dto;

import com.ecommerce.thriftauction.entity.ProductCondition;
import com.ecommerce.thriftauction.entity.SellType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {
    private String categoryId;
    private String title;
    private String description;
    private ProductCondition condition;
    private SellType sellType;
    @NotNull(message = "Price is required")
    private BigDecimal price;

    private String imageUrl;

    private Integer auctionDurationDays;
}
