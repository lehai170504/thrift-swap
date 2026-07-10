package com.ecommerce.thriftauction.features.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private String avatar;
    private java.util.Set<String> interests;
    private String role;
    @com.fasterxml.jackson.annotation.JsonProperty("isActive")
    private boolean isActive;
    private LocalDateTime createdAt;
}
