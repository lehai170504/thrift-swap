package com.ecommerce.thriftauction.features.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {
    private String id;
    private String username;
    private String fullName;
    private String avatar;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private long unreadCount;
    private LocalDateTime lastActiveAt;
}
