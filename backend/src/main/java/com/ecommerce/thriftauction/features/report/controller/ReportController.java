package com.ecommerce.thriftauction.features.report.controller;

import com.ecommerce.thriftauction.features.report.dto.ReportRequest;
import com.ecommerce.thriftauction.features.report.dto.ReportResponse;
import com.ecommerce.thriftauction.features.report.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponse> submitReport(@Valid @RequestBody ReportRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(reportService.submitReport(authentication.getName(), request));
    }
}
