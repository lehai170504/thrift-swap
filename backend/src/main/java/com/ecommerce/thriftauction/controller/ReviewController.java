package com.ecommerce.thriftauction.controller;

import com.ecommerce.thriftauction.dto.ReviewRequest;
import com.ecommerce.thriftauction.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Review")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/order/{orderId}")
    public ResponseEntity<?> createReview(
            @PathVariable String orderId,
            @RequestBody ReviewRequest request,
            Authentication authentication) {
        try {
            return ResponseEntity.ok(reviewService.createReview(orderId, authentication.getName(), request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getReviewsByUser(@PathVariable String username) {
        try {
            return ResponseEntity.ok(reviewService.getReviewsByUsername(username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

