package com.ecommerce.thriftauction.service;

import com.ecommerce.thriftauction.dto.ReviewRequest;
import com.ecommerce.thriftauction.dto.ReviewResponse;
import com.ecommerce.thriftauction.entity.Order;
import com.ecommerce.thriftauction.entity.OrderStatus;
import com.ecommerce.thriftauction.entity.Review;
import com.ecommerce.thriftauction.entity.User;
import com.ecommerce.thriftauction.repository.OrderRepository;
import com.ecommerce.thriftauction.repository.ReviewRepository;
import com.ecommerce.thriftauction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse createReview(String orderId, String username, ReviewRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getBuyer().getEmail().equals(username) && !order.getBuyer().getUsername().equals(username)) {
            throw new RuntimeException("Chỉ người mua mới có quyền đánh giá.");
        }

        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new RuntimeException("Chỉ có thể đánh giá sau khi đơn hàng đã hoàn thành.");
        }

        if (reviewRepository.findByOrderId(orderId).isPresent()) {
            throw new RuntimeException("Bạn đã đánh giá đơn hàng này rồi.");
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Điểm đánh giá phải từ 1 đến 5.");
        }

        Review review = Review.builder()
                .reviewer(order.getBuyer())
                .reviewee(order.getSeller())
                .order(order)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);
        return mapToResponse(savedReview);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByUsername(String username) {
        User user = userRepository.findByEmail(username)
                .or(() -> userRepository.findByUsername(username))
                .orElseThrow(() -> new RuntimeException("User not found"));

        return reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .reviewerName(review.getReviewer().getUsername())
                .reviewerAvatar(review.getReviewer().getAvatar())
                .revieweeName(review.getReviewee().getUsername())
                .orderId(review.getOrder().getId())
                .productTitle(review.getOrder().getProduct().getTitle())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
