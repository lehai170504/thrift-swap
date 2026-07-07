package com.ecommerce.thriftauction.repository;

import com.ecommerce.thriftauction.entity.RefreshToken;
import com.ecommerce.thriftauction.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(User user);
}
