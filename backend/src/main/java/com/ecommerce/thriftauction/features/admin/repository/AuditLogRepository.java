package com.ecommerce.thriftauction.features.admin.repository;

import com.ecommerce.thriftauction.features.admin.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {

    @Query("SELECT a FROM AuditLog a WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            " LOWER(a.actorUsername) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            " LOWER(a.action) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            " LOWER(a.targetType) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            " LOWER(a.targetLabel) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:action IS NULL OR :action = '' OR a.action = :action) " +
            "AND (:actorRole IS NULL OR :actorRole = '' OR a.actorRole = :actorRole) " +
            "ORDER BY a.createdAt DESC")
    Page<AuditLog> findAllWithFilter(
            @Param("search") String search,
            @Param("action") String action,
            @Param("actorRole") String actorRole,
            Pageable pageable);
}
