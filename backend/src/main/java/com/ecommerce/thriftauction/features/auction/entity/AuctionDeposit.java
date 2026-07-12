package com.ecommerce.thriftauction.features.auction.entity;

import com.ecommerce.thriftauction.features.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "auction_deposits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionDeposit {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_session_id", nullable = false)
    private AuctionSession auctionSession;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private boolean isRefunded;

    @Column(nullable = false)
    private LocalDateTime depositedAt;

    @PrePersist
    protected void onCreate() {
        depositedAt = LocalDateTime.now();
    }
}
