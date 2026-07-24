package com.ecommerce.thriftauction.features.admin.controller;

import com.ecommerce.thriftauction.features.admin.dto.SystemConfigDto;
import com.ecommerce.thriftauction.features.admin.service.SystemConfigService;
import com.ecommerce.thriftauction.features.admin.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/settings")
@RequiredArgsConstructor
@Tag(name = "Admin System Config", description = "Admin cấu hình thông số hệ thống (Phí sàn, rút tiền...)")
public class SystemConfigController {

    private final SystemConfigService systemConfigService;
    private final AuditLogService auditLogService;

    @Operation(summary = "Lấy cấu hình hệ thống")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<SystemConfigDto> getConfig() {
        return ResponseEntity.ok(systemConfigService.getConfigDto());
    }

    @Operation(summary = "Cập nhật cấu hình hệ thống")
    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemConfigDto> updateConfig(
            @Valid @RequestBody SystemConfigDto dto,
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request) {

        SystemConfigDto updated = systemConfigService.updateConfig(dto);

        auditLogService.logAdmin(
                userDetails.getUsername(), "UPDATE_SYSTEM_CONFIG",
                "SYSTEM_CONFIG", "1", "System Config",
                "Cập nhật cấu hình: Phí " + dto.getPlatformFeePercent() + ", Min rút " + dto.getMinWithdrawalAmount(),
                request.getRemoteAddr());

        return ResponseEntity.ok(updated);
    }
}
