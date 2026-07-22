package com.ecommerce.thriftauction.features.product.scheduler;

import com.ecommerce.thriftauction.features.product.entity.Product;
import com.ecommerce.thriftauction.features.product.entity.ProductStatus;
import com.ecommerce.thriftauction.features.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CleanupScheduler {

    private final ProductRepository productRepository;

    // Run every day at 2:00 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupHiddenProducts() {
        log.info("Running Scheduled Job: cleanupHiddenProducts");

        // Find products that are HIDDEN and updated more than 7 days ago
        LocalDateTime thresholdDate = LocalDateTime.now().minusDays(7);
        List<Product> oldHiddenProducts = productRepository.findByStatusAndUpdatedAtBefore(ProductStatus.HIDDEN,
                thresholdDate);

        if (!oldHiddenProducts.isEmpty()) {
            log.info("Found {} hidden products older than 7 days to mark as DELETED", oldHiddenProducts.size());
            for (Product product : oldHiddenProducts) {
                try {
                    // Soft delete to avoid breaking historical records (like view history,
                    // deposits, etc.)
                    product.setStatus(ProductStatus.DELETED);
                    productRepository.save(product);
                    log.info("Successfully marked product {} as DELETED", product.getId());
                } catch (Exception e) {
                    log.error("Failed to delete product {}: {}", product.getId(), e.getMessage());
                }
            }
        } else {
            log.info("No hidden products found older than 7 days.");
        }
    }
}
