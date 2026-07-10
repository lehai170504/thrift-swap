package com.ecommerce.thriftauction.features.ai.dto.request;

import lombok.Data;

@Data
public class AiRequest {
    private String productName;
    private String condition;
}
