package com.ecommerce.thriftauction.features.auction.entity;

import com.ecommerce.thriftauction.features.auth.entity.User;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "auction_bids")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionBid {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_session_id", nullable = false)
    private AuctionSession auctionSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bidder_id", nullable = false)
    private User bidder;

    @Column(nullable = false)
    private BigDecimal bidAmount;

    private LocalDateTime bidTime;

    @PrePersist
    protected void onCreate() {
        bidTime = LocalDateTime.now();
    }
}
