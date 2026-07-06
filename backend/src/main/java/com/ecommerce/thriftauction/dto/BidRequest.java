package com.ecommerce.thriftauction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BidRequest {
    private String auctionSessionId;
    private BigDecimal bidAmount;
}
