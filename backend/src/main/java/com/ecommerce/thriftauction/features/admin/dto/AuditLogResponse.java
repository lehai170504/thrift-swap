package com.ecommerce.thriftauction.features.admin.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AuditLogResponse {
    private String id;
    private String actorUsername;
    private String actorRole;
    private String action;
    private String targetType;
    private String targetId;
    private String targetLabel;
    private String detail;
    private String ipAddress;
    private LocalDateTime createdAt;
}
