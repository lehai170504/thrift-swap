package com.ecommerce.thriftauction.dto;

import com.ecommerce.thriftauction.entity.ProductCondition;
import com.ecommerce.thriftauction.entity.ProductStatus;
import com.ecommerce.thriftauction.entity.SellType;
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
public class ProductResponse {
    private String id;
    private String sellerId;
    private String sellerName;
    private String categoryId;
    private String categoryName;
    private String title;
    private String description;
    private ProductCondition condition;
    private SellType sellType;
    private BigDecimal price;
    private Integer quantity;
    private ProductStatus status;
    private String imageUrl;
    private String videoUrl;
    private String location;
    private LocalDateTime createdAt;
    private LocalDateTime auctionEndTime;
    private LocalDateTime boostedUntil;
}
