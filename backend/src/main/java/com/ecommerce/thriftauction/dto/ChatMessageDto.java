package com.ecommerce.thriftauction.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {
    private String senderUsername;
    private String receiverUsername;
    private String content;
    private LocalDateTime timestamp;

    @JsonProperty("isRead")
    private boolean isRead;
}
