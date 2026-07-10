package com.ecommerce.thriftauction.features.auction.service;

import com.ecommerce.thriftauction.features.notification.service.NotificationService;

import com.ecommerce.thriftauction.features.common.dto.BidRequest;
import com.ecommerce.thriftauction.features.common.dto.BidResponse;
import com.ecommerce.thriftauction.features.auction.entity.AuctionBid;
import com.ecommerce.thriftauction.features.auction.entity.AuctionSession;
import com.ecommerce.thriftauction.features.auction.entity.AuctionStatus;
import com.ecommerce.thriftauction.features.auth.entity.User;
import com.ecommerce.thriftauction.features.auction.repository.AuctionBidRepository;
import com.ecommerce.thriftauction.features.auction.repository.AuctionSessionRepository;
import com.ecommerce.thriftauction.features.auth.repository.UserRepository;
import com.ecommerce.thriftauction.features.notification.entity.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuctionService {

    private final AuctionSessionRepository auctionSessionRepository;
    private final AuctionBidRepository auctionBidRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public BidResponse placeBid(BidRequest request, String username) {
        User bidder = userRepository.findByEmail(username)
                .or(() -> userRepository.findByUsername(username))
                .orElseThrow(() -> new RuntimeException("User not found"));

        AuctionSession session = auctionSessionRepository.findByProductId(request.getAuctionSessionId())
                .orElseThrow(() -> new RuntimeException(
                        "Auction session not found for product: " + request.getAuctionSessionId()));

        if (session.getStatus() != AuctionStatus.ONGOING) {
            throw new RuntimeException("Auction is not active");
        }

        if (session.getProduct().getSeller().getId().equals(bidder.getId())) {
            throw new RuntimeException("Seller cannot bid on their own auction");
        }

        if (session.getEndTime().isBefore(LocalDateTime.now())) {
            session.setStatus(AuctionStatus.ENDED);
            auctionSessionRepository.save(session);
            throw new RuntimeException("Auction has already ended");
        }

        BigDecimal currentHighest = session.getCurrentHighestPrice() != null
                ? session.getCurrentHighestPrice()
                : session.getStartingPrice();

        if (request.getBidAmount().compareTo(currentHighest.add(session.getStepPrice())) < 0) {
            throw new RuntimeException("Bid amount must be at least " + currentHighest.add(session.getStepPrice()));
        }

        // Find previous highest bidder to notify
        List<AuctionBid> previousBids = auctionBidRepository
                .findByAuctionSessionIdOrderByBidAmountDesc(session.getId());
        User previousHighestBidder = null;
        if (!previousBids.isEmpty()) {
            previousHighestBidder = previousBids.get(0).getBidder();
        }

        AuctionBid bid = AuctionBid.builder()
                .auctionSession(session)
                .bidder(bidder)
                .bidAmount(request.getBidAmount())
                .build();

        auctionBidRepository.save(bid);

        session.setCurrentHighestPrice(request.getBidAmount());
        auctionSessionRepository.save(session);

        // Send outbid notification
        if (previousHighestBidder != null && !previousHighestBidder.getId().equals(bidder.getId())) {
            notificationService.createAndSendNotification(
                    previousHighestBidder,
                    "Bạn đã bị trả giá cao hơn!",
                    "Người dùng " + bidder.getUsername() + " vừa trả " + request.getBidAmount() + "đ cho sản phẩm "
                            + session.getProduct().getTitle(),
                    NotificationType.AUCTION_OUTBID,
                    session.getProduct().getId());
        }

        return BidResponse.builder()
                .bidId(bid.getId())
                .auctionSessionId(session.getId())
                .bidderName(bidder.getUsername())
                .bidAmount(bid.getBidAmount())
                .bidTime(bid.getBidTime())
                .message("Bid placed successfully!")
                .build();
    }

    @Transactional(readOnly = true)
    public List<BidResponse> getAuctionHistory(String productId) {
        AuctionSession session = auctionSessionRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Auction session not found for product: " + productId));

        List<AuctionBid> bids = auctionBidRepository.findByAuctionSessionIdOrderByBidAmountDesc(session.getId());

        return bids.stream().map(bid -> BidResponse.builder()
                .bidId(bid.getId())
                .auctionSessionId(session.getId())
                .bidderName(bid.getBidder().getUsername())
                .bidAmount(bid.getBidAmount())
                .bidTime(bid.getBidTime())
                .build()).collect(Collectors.toList());
    }
}
