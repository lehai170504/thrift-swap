package com.ecommerce.thriftauction.features.voucher.repository;

import com.ecommerce.thriftauction.features.voucher.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.Optional;
import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {
    Optional<Voucher> findByCodeAndIsActiveTrue(String code);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM Voucher v WHERE v.code = :code AND v.isActive = true")
    Optional<Voucher> findByCodeAndIsActiveTrueForUpdate(@Param("code") String code);

    List<Voucher> findBySellerIdAndIsActiveTrue(String sellerId);

    List<Voucher> findBySellerIsNullAndIsActiveTrue(); // Platform vouchers

    List<Voucher> findBySellerIdOrderByCreatedAtDesc(String sellerId);

    boolean existsByCode(String code);
}
