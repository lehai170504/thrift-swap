package com.ecommerce.thriftauction.repository;

import com.ecommerce.thriftauction.entity.AuctionSession;
import com.ecommerce.thriftauction.entity.AuctionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionSessionRepository extends JpaRepository<AuctionSession, String> {
    List<AuctionSession> findByStatus(AuctionStatus status);

    java.util.Optional<AuctionSession> findByProductId(String productId);
}
