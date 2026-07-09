package com.ecommerce.thriftauction.repository;

import com.ecommerce.thriftauction.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {
    Optional<Voucher> findByCodeAndIsActiveTrue(String code);

    List<Voucher> findBySellerIdAndIsActiveTrue(String sellerId);

    List<Voucher> findBySellerIsNullAndIsActiveTrue(); // Platform vouchers

    List<Voucher> findBySellerIdOrderByCreatedAtDesc(String sellerId);

    boolean existsByCode(String code);
}
