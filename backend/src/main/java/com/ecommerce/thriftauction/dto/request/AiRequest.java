package com.ecommerce.thriftauction.dto.request;

import lombok.Data;

@Data
public class AiRequest {
    private String productName;
    private String condition;
}
