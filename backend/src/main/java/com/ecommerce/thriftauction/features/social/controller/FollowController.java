package com.ecommerce.thriftauction.features.social.controller;

import com.ecommerce.thriftauction.features.social.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{username}")
    public ResponseEntity<Map<String, Object>> toggleFollow(
            @PathVariable String username,
            Authentication authentication) {
        String followerUsername = authentication.getName();
        return ResponseEntity.ok(followService.toggleFollow(followerUsername, username));
    }

    @GetMapping("/{username}/status")
    public ResponseEntity<Map<String, Boolean>> getFollowStatus(
            @PathVariable String username,
            Authentication authentication) {
        boolean isFollowing = false;
        if (authentication != null && authentication.isAuthenticated()
                && !authentication.getPrincipal().equals("anonymousUser")) {
            isFollowing = followService.checkFollowStatus(authentication.getName(), username);
        }
        return ResponseEntity.ok(Map.of("isFollowing", isFollowing));
    }

    @GetMapping("/{username}/count")
    public ResponseEntity<Map<String, Long>> getFollowerCount(@PathVariable String username) {
        long count = followService.getFollowerCount(username);
        return ResponseEntity.ok(Map.of("followerCount", count));
    }

    @GetMapping("/{username}/followers")
    public ResponseEntity<List<com.ecommerce.thriftauction.features.auth.dto.UserResponse>> getFollowers(
            @PathVariable String username) {
        return ResponseEntity.ok(followService.getFollowers(username));
    }
}
