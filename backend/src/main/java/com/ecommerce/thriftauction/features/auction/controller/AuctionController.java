package com.ecommerce.thriftauction.features.auction.controller;

import com.ecommerce.thriftauction.features.common.dto.BidRequest;
import com.ecommerce.thriftauction.features.common.dto.BidResponse;
import com.ecommerce.thriftauction.features.auction.service.AuctionService;
import com.ecommerce.thriftauction.features.order.service.OrderService;
import com.ecommerce.thriftauction.core.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Auction")
public class AuctionController {

    private final AuctionService auctionService;
    private final OrderService orderService;
    private final SimpMessagingTemplate messagingTemplate;
    private final JwtService jwtService;

    @MessageMapping("/auction/bid")
    public void placeBid(@Payload BidRequest request,
            @org.springframework.messaging.handler.annotation.Header(value = "Authorization", defaultValue = "") String authHeader,
            SimpMessageHeaderAccessor headerAccessor) {
        System.out.println(
                "Received bid request for: " + request.getAuctionSessionId() + " amount: " + request.getBidAmount());
        try {
            if (authHeader == null || authHeader.isEmpty() || !authHeader.startsWith("Bearer ")) {
                authHeader = headerAccessor.getFirstNativeHeader("Authorization");
            }
            if (authHeader == null || authHeader.isEmpty() || !authHeader.startsWith("Bearer ")) {
                System.out.println("Unauthorized STOMP request. Auth header: " + authHeader);
                return; // Unauthorized
            }
            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);
            if (username == null) {
                System.out.println("Username could not be extracted from token");
                return;
            }

            BidResponse response = auctionService.placeBid(request, username);

            System.out.println("Bid placed successfully. Broadcasting...");
            messagingTemplate.convertAndSend("/topic/auction/" + request.getAuctionSessionId(), response);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Bid Error: " + e.getMessage());

            // Send error message back to the specific user's queue
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                try {
                    String username = jwtService.extractUsername(authHeader.substring(7));
                    if (username != null) {
                        messagingTemplate.convertAndSendToUser(username, "/queue/errors", e.getMessage());
                    }
                } catch (Exception ex) {
                    System.err.println("Could not send error back: " + ex.getMessage());
                }
            }
        }
    }

    @GetMapping("/api/v1/auctions/{productId}/bids")
    public ResponseEntity<List<BidResponse>> getAuctionHistory(@PathVariable String productId) {
        try {
            List<BidResponse> bids = auctionService.getAuctionHistory(productId);
            return ResponseEntity.ok(bids);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @org.springframework.web.bind.annotation.PostMapping("/api/v1/auctions/{productId}/end")
    public ResponseEntity<?> endAuction(@PathVariable String productId) {
        try {
            return ResponseEntity.ok(orderService.endAuctionAndCreateOrder(productId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @org.springframework.web.bind.annotation.GetMapping("/api/v1/auctions/{productId}/deposit-status")
    public ResponseEntity<Boolean> getDepositStatus(@PathVariable String productId,
            @org.springframework.web.bind.annotation.RequestHeader(value = "Authorization", defaultValue = "") String authHeader) {
        try {
            if (authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String username = jwtService.extractUsername(token);
                boolean hasDeposited = auctionService.hasDeposited(productId, username);
                return ResponseEntity.ok(hasDeposited);
            }
            return ResponseEntity.ok(false);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }

    @org.springframework.web.bind.annotation.PostMapping("/api/v1/auctions/{productId}/deposit")
    public ResponseEntity<?> placeDeposit(@PathVariable String productId,
            @org.springframework.web.bind.annotation.RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);
            auctionService.placeDeposit(productId, username);
            return ResponseEntity.ok(java.util.Map.of("message", "Đặt cọc thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
