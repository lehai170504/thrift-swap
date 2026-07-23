package com.ecommerce.thriftauction.features.report.controller;

import com.ecommerce.thriftauction.features.report.dto.ReportResponse;
import com.ecommerce.thriftauction.features.report.entity.ReportStatus;
import com.ecommerce.thriftauction.features.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminReportController {
    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<Page<ReportResponse>> getAllReports(Pageable pageable) {
        return ResponseEntity.ok(reportService.getAllReports(pageable));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ReportResponse> updateReportStatus(@PathVariable String id,
            @RequestParam ReportStatus status) {
        return ResponseEntity.ok(reportService.updateReportStatus(id, status));
    }
}
