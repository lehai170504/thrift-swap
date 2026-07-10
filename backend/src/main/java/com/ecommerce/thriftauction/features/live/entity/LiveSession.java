package com.ecommerce.thriftauction.features.live.entity;

import com.ecommerce.thriftauction.features.auction.entity.AuctionSession;
import com.ecommerce.thriftauction.features.auth.entity.User;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "live_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveSession {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_session_id", nullable = false)
    private AuctionSession auctionSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    @Column(nullable = false)
    private String agoraChannelName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private LiveStatus status = LiveStatus.LIVE;

    @Builder.Default
    private Integer viewerCount = 0;

    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    public enum LiveStatus {
        LIVE,
        ENDED
    }
}
