package com.ecommerce.thriftauction.service;

import com.ecommerce.thriftauction.dto.GlobalSearchResult;
import com.ecommerce.thriftauction.entity.Order;
import com.ecommerce.thriftauction.entity.Product;
import com.ecommerce.thriftauction.entity.User;
import com.ecommerce.thriftauction.repository.OrderRepository;
import com.ecommerce.thriftauction.repository.ProductRepository;
import com.ecommerce.thriftauction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminSearchService {

        private final UserRepository userRepository;
        private final OrderRepository orderRepository;
        private final ProductRepository productRepository;

        public GlobalSearchResult search(String query) {
                if (query == null || query.trim().isEmpty()) {
                        return GlobalSearchResult.builder()
                                        .users(List.of())
                                        .orders(List.of())
                                        .products(List.of())
                                        .build();
                }

                String searchStr = query.trim();
                String orderIdSearchStr = searchStr.replace("#", "");

                List<User> users = userRepository.findTop5ByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                                searchStr, searchStr);
                List<GlobalSearchResult.UserSearchItem> userItems = users.stream()
                                .map(u -> GlobalSearchResult.UserSearchItem.builder()
                                                .id(u.getId())
                                                .username(u.getUsername())
                                                .email(u.getEmail())
                                                .avatar(u.getAvatar())
                                                .build())
                                .collect(Collectors.toList());

                List<Order> orders = orderRepository.searchOrdersByQuery(orderIdSearchStr, PageRequest.of(0, 5));
                List<GlobalSearchResult.OrderSearchItem> orderItems = orders.stream()
                                .map(o -> GlobalSearchResult.OrderSearchItem.builder()
                                                .id(o.getId())
                                                .productTitle(o.getProduct().getTitle())
                                                .buyerName(o.getBuyer().getUsername())
                                                .status(o.getStatus().name())
                                                .build())
                                .collect(Collectors.toList());

                Page<Product> products = productRepository.findByTitleContainingIgnoreCase(searchStr,
                                PageRequest.of(0, 5));
                List<GlobalSearchResult.ProductSearchItem> productItems = products.stream()
                                .map(p -> GlobalSearchResult.ProductSearchItem.builder()
                                                .id(p.getId())
                                                .title(p.getTitle())
                                                .categoryName(p.getCategory() != null ? p.getCategory().getName() : "")
                                                .status(p.getStatus().name())
                                                .imageUrl(p.getImageUrl())
                                                .build())
                                .collect(Collectors.toList());

                return GlobalSearchResult.builder()
                                .users(userItems)
                                .orders(orderItems)
                                .products(productItems)
                                .build();
        }
}
