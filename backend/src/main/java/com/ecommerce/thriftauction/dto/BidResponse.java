package com.ecommerce.thriftauction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BidResponse {
    private String bidId;
    private String auctionSessionId;
    private String bidderName;
    private BigDecimal bidAmount;
    private LocalDateTime bidTime;
    private String message;
}
