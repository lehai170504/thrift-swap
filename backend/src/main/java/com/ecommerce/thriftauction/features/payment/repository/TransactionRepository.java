package com.ecommerce.thriftauction.features.payment.repository;

import com.ecommerce.thriftauction.features.payment.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.ecommerce.thriftauction.features.payment.entity.TransactionType;
import com.ecommerce.thriftauction.features.payment.entity.TransactionStatus;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
        List<Transaction> findByWalletIdOrderByCreatedAtDesc(String walletId);

        boolean existsByReferenceId(String referenceId);

        Page<Transaction> findByTypeAndStatusOrderByCreatedAtDesc(TransactionType type, TransactionStatus status,
                        Pageable pageable);

        @org.springframework.data.jpa.repository.Query("SELECT t FROM Transaction t WHERE t.type = :type AND t.status = :status AND (:search IS NULL OR :search = '' OR LOWER(t.wallet.user.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
        Page<Transaction> findByTypeAndStatusAndSearch(
                        @org.springframework.data.repository.query.Param("type") TransactionType type,
                        @org.springframework.data.repository.query.Param("status") TransactionStatus status,
                        @org.springframework.data.repository.query.Param("search") String search, Pageable pageable);
}
