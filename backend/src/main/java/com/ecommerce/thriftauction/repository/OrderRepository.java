package com.ecommerce.thriftauction.repository;

import com.ecommerce.thriftauction.entity.Order;
import com.ecommerce.thriftauction.entity.OrderStatus;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Page<Order> findByBuyerIdOrderByCreatedAtDesc(String buyerId, Pageable pageable);

    Page<Order> findBySellerIdOrderByCreatedAtDesc(String sellerId, Pageable pageable);

    Optional<Order> findByProductId(String productId);

    Page<Order> findByStatusOrderByCreatedAtDesc(com.ecommerce.thriftauction.entity.OrderStatus status,
            Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT o FROM Order o WHERE (:search IS NULL OR :search = '' OR o.id = :search OR LOWER(o.product.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(o.buyer.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(o.seller.username) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Order> searchAllOrders(@org.springframework.data.repository.query.Param("search") String search,
            Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT o FROM Order o WHERE o.status = :status AND (:search IS NULL OR :search = '' OR o.id = :search OR LOWER(o.product.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(o.buyer.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(o.seller.username) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Order> findByStatusAndSearch(
            @org.springframework.data.repository.query.Param("status") com.ecommerce.thriftauction.entity.OrderStatus status,
            @org.springframework.data.repository.query.Param("search") String search, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT o FROM Order o WHERE o.id = :query OR LOWER(o.product.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Order> searchOrdersByQuery(@org.springframework.data.repository.query.Param("query") String query,
            Pageable pageable);

    List<Order> findByStatusAndCreatedAtGreaterThanEqual(OrderStatus status, LocalDateTime createdAt);
}
