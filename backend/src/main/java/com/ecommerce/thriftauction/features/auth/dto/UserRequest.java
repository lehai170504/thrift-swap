package com.ecommerce.thriftauction.features.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {
    private String fullName;
    private String phone;
    private String address;
    private String avatar;
    private java.util.Set<String> interests;
}
