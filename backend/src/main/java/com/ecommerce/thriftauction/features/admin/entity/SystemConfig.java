package com.ecommerce.thriftauction.features.admin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "system_configs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Platform fee percentage (e.g. 0.05 for 5%)
    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal platformFeePercent;

    // Minimum withdrawal amount
    @Column(nullable = false)
    private BigDecimal minWithdrawalAmount;

    // Is the system currently under maintenance?
    @Column(nullable = false)
    private Boolean isMaintenanceMode;
}
