package com.ecommerce.thriftauction.features.auth.service;

import com.ecommerce.thriftauction.features.auth.entity.User;
import com.ecommerce.thriftauction.features.auth.entity.UserTier;
import com.ecommerce.thriftauction.features.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoyaltyService {

    private final UserRepository userRepository;

    /**
     * Adds points to the user based on the order value (1 point for every 10,000
     * VND).
     * Upgrades the user's tier if thresholds are met.
     */
    @Transactional
    public void awardPoints(User user, BigDecimal orderValue) {
        if (user == null || orderValue == null || orderValue.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        // 1 point per 10,000 VND
        BigDecimal pointsToAdd = orderValue.divide(new BigDecimal("10000"), 2, RoundingMode.HALF_DOWN);
        BigDecimal newTotalPoints = user.getTotalPoints().add(pointsToAdd);
        user.setTotalPoints(newTotalPoints);

        // Check for tier upgrades
        UserTier oldTier = user.getTier();
        UserTier newTier = determineTier(newTotalPoints);

        if (oldTier != newTier) {
            user.setTier(newTier);
            log.info("User {} upgraded from {} to {}!", user.getUsername(), oldTier, newTier);
        }

        userRepository.save(user);
    }

    private UserTier determineTier(BigDecimal points) {
        if (points.compareTo(new BigDecimal("10000")) >= 0) {
            return UserTier.DIAMOND;
        } else if (points.compareTo(new BigDecimal("5000")) >= 0) {
            return UserTier.GOLD;
        } else if (points.compareTo(new BigDecimal("1000")) >= 0) {
            return UserTier.SILVER;
        } else {
            return UserTier.BRONZE;
        }
    }

    /**
     * Calculates the discounted platform fee percentage based on the seller's tier.
     * 
     * @param baseFee Base platform fee (e.g. 0.05 for 5%)
     * @param tier    The seller's tier
     * @return Discounted fee percentage
     */
    public BigDecimal calculateDiscountedPlatformFee(BigDecimal baseFee, UserTier tier) {
        if (baseFee == null || tier == null) {
            return baseFee;
        }

        BigDecimal discountRatio = BigDecimal.ZERO;
        switch (tier) {
            case SILVER:
                discountRatio = new BigDecimal("0.10"); // 10% off the fee
                break;
            case GOLD:
                discountRatio = new BigDecimal("0.30"); // 30% off the fee
                break;
            case DIAMOND:
                discountRatio = new BigDecimal("0.50"); // 50% off the fee
                break;
            default:
                discountRatio = BigDecimal.ZERO; // No discount for BRONZE
        }

        BigDecimal discountedFee = baseFee.multiply(BigDecimal.ONE.subtract(discountRatio));

        // Ensure fee doesn't go below 0
        if (discountedFee.compareTo(BigDecimal.ZERO) < 0) {
            return BigDecimal.ZERO;
        }

        return discountedFee;
    }
}
