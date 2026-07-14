package com.ecommerce.thriftauction.features.admin.service;

import com.ecommerce.thriftauction.features.admin.dto.AuditLogResponse;
import com.ecommerce.thriftauction.features.admin.entity.AuditLog;
import com.ecommerce.thriftauction.features.admin.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(String actorUsername, String actorRole, String action, String targetType,
            String targetId, String targetLabel, String detail, String ipAddress) {
        AuditLog entry = AuditLog.builder()
                .actorUsername(actorUsername)
                .actorRole(actorRole)
                .action(action)
                .targetType(targetType)
                .targetId(targetId)
                .targetLabel(targetLabel)
                .detail(detail)
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(entry);
    }

    @Async
    public void logAdmin(String actorUsername, String action, String targetType,
            String targetId, String targetLabel, String detail, String ipAddress) {
        log(actorUsername, "ADMIN", action, targetType, targetId, targetLabel, detail, ipAddress);
    }

    @Async
    public void logUser(String actorUsername, String action, String targetType,
            String targetId, String targetLabel, String detail) {
        log(actorUsername, "USER", action, targetType, targetId, targetLabel, detail, null);
    }

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getLogs(String search, String action, String actorRole, Pageable pageable) {
        return auditLogRepository.findAllWithFilter(search, action, actorRole, pageable)
                .map(log -> AuditLogResponse.builder()
                        .id(log.getId())
                        .actorUsername(log.getActorUsername())
                        .actorRole(log.getActorRole())
                        .action(log.getAction())
                        .targetType(log.getTargetType())
                        .targetId(log.getTargetId())
                        .targetLabel(log.getTargetLabel())
                        .detail(log.getDetail())
                        .ipAddress(log.getIpAddress())
                        .createdAt(log.getCreatedAt())
                        .build());
    }
}
