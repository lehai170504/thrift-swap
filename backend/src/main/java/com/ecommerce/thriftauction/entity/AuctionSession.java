package com.ecommerce.thriftauction.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "auction_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionSession {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private BigDecimal startingPrice;

    @Column(nullable = false)
    private BigDecimal stepPrice;

    private BigDecimal currentHighestPrice;

    @Enumerated(EnumType.STRING)
    private AuctionStatus status;
}
