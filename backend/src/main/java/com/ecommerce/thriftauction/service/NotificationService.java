package com.ecommerce.thriftauction.service;

import com.ecommerce.thriftauction.dto.NotificationResponse;
import com.ecommerce.thriftauction.entity.Notification;
import com.ecommerce.thriftauction.entity.NotificationType;
import com.ecommerce.thriftauction.entity.User;
import com.ecommerce.thriftauction.repository.NotificationRepository;
import com.ecommerce.thriftauction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

        private final NotificationRepository notificationRepository;
        private final UserRepository userRepository;
        private final SimpMessagingTemplate messagingTemplate;

        @Transactional
        public void createAndSendNotification(User user, String title, String message, NotificationType type,
                        String relatedEntityId) {
                Notification notification = Notification.builder()
                                .user(user)
                                .title(title)
                                .message(message)
                                .type(type)
                                .relatedEntityId(relatedEntityId)
                                .isRead(false)
                                .build();

                Notification saved = notificationRepository.save(notification);

                // Map to response and send via WebSocket
                NotificationResponse response = mapToResponse(saved);
                messagingTemplate.convertAndSendToUser(
                                user.getId(),
                                "/queue/notifications",
                                response);
        }

        public List<NotificationResponse> getMyNotifications(String username) {
                User user = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                                .stream().map(this::mapToResponse).collect(Collectors.toList());
        }

        public long getUnreadCount(String username) {
                User user = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
        }

        @Transactional
        public void markAsRead(String notificationId, String username) {
                Notification notification = notificationRepository.findById(notificationId)
                                .orElseThrow(() -> new RuntimeException("Notification not found"));

                User user = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!notification.getUser().getId().equals(user.getId())) {
                        throw new RuntimeException("Not your notification");
                }

                notification.setRead(true);
                notificationRepository.save(notification);
        }

        @Transactional
        public void markAllAsRead(String username) {
                User user = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                                .stream().filter(n -> !n.isRead()).collect(Collectors.toList());

                unread.forEach(n -> n.setRead(true));
                notificationRepository.saveAll(unread);
        }

        private NotificationResponse mapToResponse(Notification n) {
                return NotificationResponse.builder()
                                .id(n.getId())
                                .title(n.getTitle())
                                .message(n.getMessage())
                                .type(n.getType())
                                .relatedEntityId(n.getRelatedEntityId())
                                .isRead(n.isRead())
                                .createdAt(n.getCreatedAt())
                                .build();
        }
}
