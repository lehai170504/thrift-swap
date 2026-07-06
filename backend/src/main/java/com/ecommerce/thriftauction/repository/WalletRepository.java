package com.ecommerce.thriftauction.repository;

import com.ecommerce.thriftauction.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.math.BigDecimal;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, String> {
    Optional<Wallet> findByUserId(String userId);

    @Query("SELECT SUM(w.heldBalance) FROM Wallet w")
    BigDecimal sumHeldBalance();
}
