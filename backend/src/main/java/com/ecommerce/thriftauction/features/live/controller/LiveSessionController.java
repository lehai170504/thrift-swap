package com.ecommerce.thriftauction.features.live.controller;

import com.ecommerce.thriftauction.features.live.dto.LiveSessionDto;
import com.ecommerce.thriftauction.features.live.service.LiveSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/lives")
@RequiredArgsConstructor
public class LiveSessionController {
    private final LiveSessionService liveSessionService;

    @PostMapping("/start/{productId}")
    public ResponseEntity<LiveSessionDto> startLiveSession(
            @PathVariable String productId,
            Authentication authentication) {
        return ResponseEntity.ok(liveSessionService.startLiveSession(productId, authentication.getName()));
    }

    @PostMapping("/end/{productId}")
    public ResponseEntity<LiveSessionDto> endLiveSession(
            @PathVariable String productId,
            @RequestParam(defaultValue = "false") boolean endAuction,
            Authentication authentication) {
        return ResponseEntity.ok(liveSessionService.endLiveSession(productId, authentication.getName(), endAuction));
    }

    @GetMapping("/auction/{productId}")
    public ResponseEntity<LiveSessionDto> getLiveSession(@PathVariable String productId) {
        return ResponseEntity.ok(liveSessionService.getLiveSessionByAuction(productId));
    }

    @GetMapping("/active")
    public ResponseEntity<java.util.List<LiveSessionDto>> getActiveLiveAuctions() {
        return ResponseEntity.ok(liveSessionService.getActiveLiveAuctions());
    }
}
