package com.ecommerce.thriftauction.features.report.dto;

import com.ecommerce.thriftauction.features.report.entity.ReportStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReportResponse {
    private String id;
    private String reporterId;
    private String reporterUsername;
    private String reportedProductId;
    private String reportedProductTitle;
    private String reason;
    private ReportStatus status;
    private LocalDateTime createdAt;
}
