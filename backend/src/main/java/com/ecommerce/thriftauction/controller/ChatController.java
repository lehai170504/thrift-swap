package com.ecommerce.thriftauction.controller;

import com.ecommerce.thriftauction.dto.ChatMessageDto;
import com.ecommerce.thriftauction.entity.ChatMessage;
import com.ecommerce.thriftauction.entity.User;
import com.ecommerce.thriftauction.repository.ChatMessageRepository;
import com.ecommerce.thriftauction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Chat")
public class ChatController {

        private final SimpMessagingTemplate messagingTemplate;
        private final ChatMessageRepository chatMessageRepository;
        private final UserRepository userRepository;

        @MessageMapping("/chat.sendMessage")
        public void sendMessage(@Payload ChatMessageDto chatMessageDto, SimpMessageHeaderAccessor headerAccessor) {
                if (headerAccessor.getUser() == null)
                        return;

                String senderEmail = headerAccessor.getUser().getName();
                User sender = userRepository.findByEmail(senderEmail)
                                .orElseThrow(() -> new RuntimeException("Sender not found"));
                User receiver = userRepository.findByUsername(chatMessageDto.getReceiverUsername())
                                .orElseThrow(() -> new RuntimeException("Receiver not found"));

                ChatMessage message = ChatMessage.builder()
                                .sender(sender)
                                .receiver(receiver)
                                .content(chatMessageDto.getContent())
                                .build();

                chatMessageRepository.save(message);

                chatMessageDto.setSenderUsername(sender.getUsername());
                chatMessageDto.setTimestamp(message.getTimestamp());

                // Send to receiver
                messagingTemplate.convertAndSendToUser(
                                receiver.getEmail(),
                                "/queue/messages",
                                chatMessageDto);
                // Optional: Send back to sender's other tabs/devices
                messagingTemplate.convertAndSendToUser(
                                senderEmail,
                                "/queue/messages",
                                chatMessageDto);
        }
}

