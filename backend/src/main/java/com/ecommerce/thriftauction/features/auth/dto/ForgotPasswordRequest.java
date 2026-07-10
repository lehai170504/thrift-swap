package com.ecommerce.thriftauction.features.auth.dto;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String email;
}
