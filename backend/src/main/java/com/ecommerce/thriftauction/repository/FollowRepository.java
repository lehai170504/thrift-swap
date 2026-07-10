package com.ecommerce.thriftauction.repository;

import com.ecommerce.thriftauction.entity.Follow;
import com.ecommerce.thriftauction.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, String> {
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    java.util.List<Follow> findByFollowing(User following);

    boolean existsByFollowerAndFollowing(User follower, User following);

    long countByFollower(User follower);

    long countByFollowing(User following);
}
