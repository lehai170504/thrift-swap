package com.ecommerce.thriftauction.features.auth.repository;

import com.ecommerce.thriftauction.features.auth.entity.RefreshToken;
import com.ecommerce.thriftauction.features.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(User user);
}
