package com.ecommerce.thriftauction.features.live.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveSessionDto {
    private String id;
    private String auctionSessionId;
    private String hostId;
    private String hostUsername;
    private String agoraChannelName;
    private String status;
    private Integer viewerCount;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
}
