package com.ecommerce.thriftauction.features.auction.repository;

import com.ecommerce.thriftauction.features.auction.entity.AuctionDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionDepositRepository extends JpaRepository<AuctionDeposit, String> {
    boolean existsByUserIdAndAuctionSessionId(String userId, String auctionSessionId);
    Optional<AuctionDeposit> findByUserIdAndAuctionSessionId(String userId, String auctionSessionId);
    List<AuctionDeposit> findByAuctionSessionIdAndIsRefundedFalse(String auctionSessionId);
}
