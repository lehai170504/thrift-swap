package com.ecommerce.thriftauction.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class GlobalSearchResult {
    private List<UserSearchItem> users;
    private List<OrderSearchItem> orders;

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
}
