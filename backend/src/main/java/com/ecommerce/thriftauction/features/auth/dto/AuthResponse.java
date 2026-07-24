package com.ecommerce.thriftauction.features.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String id;
    private String username;
    private String email;
    private String role;
    private String fullName;
    private String avatar;
    private String phone;
    private String address;
    private java.util.Set<String> interests;
    private String refreshToken;
    private java.math.BigDecimal totalPoints;
    private String tier;
    private boolean requires2FA;
}
