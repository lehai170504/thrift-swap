package com.ecommerce.thriftauction.repository;

import com.ecommerce.thriftauction.entity.VoucherUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface VoucherUsageRepository extends JpaRepository<VoucherUsage, String> {
    Optional<VoucherUsage> findByVoucherIdAndUserId(String voucherId, String userId);
    List<VoucherUsage> findByVoucherIdOrderByUsedAtDesc(String voucherId);
}
