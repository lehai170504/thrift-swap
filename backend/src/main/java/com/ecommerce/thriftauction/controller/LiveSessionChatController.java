package com.ecommerce.thriftauction.controller;

import com.ecommerce.thriftauction.dto.LiveChatMessage;
import com.ecommerce.thriftauction.repository.LiveSessionRepository;
import com.ecommerce.thriftauction.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class LiveSessionChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final JwtService jwtService;
    private final LiveSessionRepository liveSessionRepository;

    @MessageMapping("/live.chat/{sessionId}")
    public void processMessage(@Payload LiveChatMessage message,
            @DestinationVariable String sessionId,
            SimpMessageHeaderAccessor headerAccessor) {

        String authHeader = headerAccessor.getFirstNativeHeader("Authorization");
        String username = "Anonymous";

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String extracted = jwtService.extractUsername(token);
            if (extracted != null) {
                username = extracted;
            }
        }

        if (message.getType() == LiveChatMessage.MessageType.CHAT
                || message.getType() == LiveChatMessage.MessageType.REACTION) {
            if (username.equals("Anonymous")) {
                return; // Only authenticated users can chat or react
            }
        }

        message.setSenderUsername(username);
        message.setTimestamp(LocalDateTime.now());
        message.setLiveSessionId(sessionId);

        if (message.getType() == LiveChatMessage.MessageType.JOIN) {
            handleJoinLeave(sessionId, true, message);
        } else if (message.getType() == LiveChatMessage.MessageType.LEAVE) {
            handleJoinLeave(sessionId, false, message);
        } else {
            // Normal chat message
            messagingTemplate.convertAndSend("/topic/live/" + sessionId, message);
        }
    }

    @Transactional
    protected void handleJoinLeave(String sessionId, boolean isJoin, LiveChatMessage message) {
        liveSessionRepository.findById(sessionId).ifPresent(session -> {
            if (message.getSenderUsername() != null
                    && message.getSenderUsername().equals(session.getHost().getUsername())) {
                message.setViewerCount(session.getViewerCount() != null ? session.getViewerCount() : 0);
                messagingTemplate.convertAndSend("/topic/live/" + sessionId, message);
                return;
            }

            int currentCount = session.getViewerCount() != null ? session.getViewerCount() : 0;
            if (isJoin) {
                session.setViewerCount(currentCount + 1);
            } else {
                session.setViewerCount(Math.max(0, currentCount - 1));
            }
            liveSessionRepository.save(session);

            message.setViewerCount(session.getViewerCount());
            messagingTemplate.convertAndSend("/topic/live/" + sessionId, message);
        });
    }
}
