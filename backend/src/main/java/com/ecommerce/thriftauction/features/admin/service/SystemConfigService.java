package com.ecommerce.thriftauction.features.admin.service;

import com.ecommerce.thriftauction.features.admin.dto.SystemConfigDto;
import com.ecommerce.thriftauction.features.admin.entity.SystemConfig;
import com.ecommerce.thriftauction.features.admin.repository.SystemConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class SystemConfigService {

    private final SystemConfigRepository systemConfigRepository;

    @Transactional
    public SystemConfig getConfig() {
        return systemConfigRepository.findById(1L).orElseGet(() -> {
            SystemConfig defaultConfig = SystemConfig.builder()
                    .platformFeePercent(new BigDecimal("0.05")) // 5% by default
                    .minWithdrawalAmount(new BigDecimal("50000")) // 50k VND by default
                    .isMaintenanceMode(false)
                    .build();
            return systemConfigRepository.save(defaultConfig);
        });
    }

    @Transactional
    public SystemConfigDto updateConfig(SystemConfigDto dto) {
        SystemConfig config = getConfig();
        config.setPlatformFeePercent(dto.getPlatformFeePercent());
        config.setMinWithdrawalAmount(dto.getMinWithdrawalAmount());
        config.setIsMaintenanceMode(dto.getIsMaintenanceMode());

        SystemConfig saved = systemConfigRepository.save(config);

        return SystemConfigDto.builder()
                .platformFeePercent(saved.getPlatformFeePercent())
                .minWithdrawalAmount(saved.getMinWithdrawalAmount())
                .isMaintenanceMode(saved.getIsMaintenanceMode())
                .build();
    }

    @Transactional
    public SystemConfigDto getConfigDto() {
        SystemConfig config = getConfig();
        return SystemConfigDto.builder()
                .platformFeePercent(config.getPlatformFeePercent())
                .minWithdrawalAmount(config.getMinWithdrawalAmount())
                .isMaintenanceMode(config.getIsMaintenanceMode())
                .build();
    }
}
