package com.ecommerce.thriftauction.features.auth.repository;

import com.ecommerce.thriftauction.features.auth.entity.OtpToken;
import com.ecommerce.thriftauction.features.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, String> {
    Optional<OtpToken> findByOtpAndUser(String otp, User user);
}
