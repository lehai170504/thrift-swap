package com.ecommerce.thriftauction.features.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
    private String id;
    private String name;
    private String description;
    private String icon;
    private String parentId;
    private List<CategoryDto> subCategories;
}
