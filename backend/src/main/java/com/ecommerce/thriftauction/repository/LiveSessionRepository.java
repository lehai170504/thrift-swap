package com.ecommerce.thriftauction.repository;

import com.ecommerce.thriftauction.entity.LiveSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LiveSessionRepository extends JpaRepository<LiveSession, String> {
    Optional<LiveSession> findByAuctionSessionId(String auctionSessionId);

    Optional<LiveSession> findByAgoraChannelName(String channelName);

    java.util.List<LiveSession> findByStatus(LiveSession.LiveStatus status);
}
