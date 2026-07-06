package com.ecommerce.thriftauction.repository;

import com.ecommerce.thriftauction.entity.AuctionBid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionBidRepository extends JpaRepository<AuctionBid, String> {
    List<AuctionBid> findByAuctionSessionIdOrderByBidAmountDesc(String auctionSessionId);
}
