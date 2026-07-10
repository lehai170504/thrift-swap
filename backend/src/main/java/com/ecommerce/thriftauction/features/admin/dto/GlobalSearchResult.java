package com.ecommerce.thriftauction.features.admin.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class GlobalSearchResult {
    private List<UserSearchItem> users;
    private List<OrderSearchItem> orders;
    private List<ProductSearchItem> products;

    @Data
    @Builder
    public static class UserSearchItem {
        private String id;
        private String username;
        private String email;
        private String avatar;
    }

    @Data
    @Builder
    public static class OrderSearchItem {
        private String id;
        private String productTitle;
        private String buyerName;
        private String status;
    }

    @Data
    @Builder
    public static class ProductSearchItem {
        private String id;
        private String title;
        private String categoryName;
        private String status;
        private String imageUrl;
    }
}
