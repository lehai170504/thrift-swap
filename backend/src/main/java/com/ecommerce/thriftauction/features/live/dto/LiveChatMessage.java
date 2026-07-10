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
public class LiveChatMessage {
    private String liveSessionId;
    private String senderId;
    private String senderUsername;
    private String senderAvatar;
    private String content;
    private MessageType type;
    private LocalDateTime timestamp;
    private Integer viewerCount; // To broadcast viewer count updates

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        BID_UPDATE, // To notify chat that a bid was placed
        REACTION // For floating emojis
    }
}
