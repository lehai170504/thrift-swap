package com.ecommerce.thriftauction.repository;

import com.ecommerce.thriftauction.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByRevieweeIdOrderByCreatedAtDesc(String revieweeId);

    Optional<Review> findByOrderId(String orderId);
}
