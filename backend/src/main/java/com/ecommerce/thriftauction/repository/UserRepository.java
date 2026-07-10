package com.ecommerce.thriftauction.repository;

import com.ecommerce.thriftauction.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.ecommerce.thriftauction.entity.Role;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastActiveAt = :lastActiveAt WHERE u.username = :username")
    void updateLastActiveAt(@Param("username") String username, @Param("lastActiveAt") LocalDateTime lastActiveAt);

    List<User> findByRole(Role role);

    Page<User> findByRoleNot(Role role, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.role != :role AND (:search IS NULL OR :search = '' OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findByRoleNotAndSearch(@org.springframework.data.repository.query.Param("role") Role role,
            @org.springframework.data.repository.query.Param("search") String search, Pageable pageable);

    List<User> findTop5ByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(String username, String email);
}
