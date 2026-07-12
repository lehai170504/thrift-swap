package com.ecommerce.thriftauction.features.product.repository;

import com.ecommerce.thriftauction.features.product.entity.ProductViewHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductViewHistoryRepository extends JpaRepository<ProductViewHistory, String> {
    List<ProductViewHistory> findByUserIdOrderByViewedAtDesc(String userId);

    Optional<ProductViewHistory> findByUserIdAndProductId(String userId, String productId);
}
