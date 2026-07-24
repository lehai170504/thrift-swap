package com.ecommerce.thriftauction.features.payment.repository;

import com.ecommerce.thriftauction.features.payment.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.ecommerce.thriftauction.features.payment.entity.TransactionType;
import com.ecommerce.thriftauction.features.payment.entity.TransactionStatus;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
        List<Transaction> findByWalletIdOrderByCreatedAtDesc(String walletId);

        boolean existsByReferenceId(String referenceId);

        Page<Transaction> findByTypeAndStatusOrderByCreatedAtDesc(TransactionType type, TransactionStatus status,
                        Pageable pageable);

        @Query("SELECT t FROM Transaction t WHERE t.type = :type AND (:status IS NULL OR t.status = :status) AND (:search IS NULL OR t.wallet.user.username LIKE %:search% OR t.wallet.user.email LIKE %:search%)")
        Page<Transaction> findByTypeAndStatusAndSearch(
                        @Param("type") TransactionType type,
                        @Param("status") TransactionStatus status,
                        @Param("search") String search,
                        Pageable pageable);

        List<Transaction> findByType(TransactionType type);

        Page<Transaction> findByTypeInOrderByCreatedAtDesc(List<TransactionType> types, Pageable pageable);
}
