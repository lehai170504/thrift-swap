package com.ecommerce.thriftauction.features.admin.service;

import com.ecommerce.thriftauction.features.product.dto.ProductResponse;
import com.ecommerce.thriftauction.features.product.entity.Product;
import com.ecommerce.thriftauction.features.product.repository.ProductRepository;
import com.ecommerce.thriftauction.features.auction.repository.AuctionSessionRepository;
import com.ecommerce.thriftauction.features.auction.repository.AuctionDepositRepository;
import com.ecommerce.thriftauction.features.payment.repository.WalletRepository;
import com.ecommerce.thriftauction.features.payment.repository.TransactionRepository;
import com.ecommerce.thriftauction.features.auction.entity.AuctionSession;
import com.ecommerce.thriftauction.features.auction.entity.AuctionStatus;
import com.ecommerce.thriftauction.features.auction.entity.AuctionDeposit;
import com.ecommerce.thriftauction.features.payment.entity.Transaction;
import com.ecommerce.thriftauction.features.payment.entity.TransactionType;
import com.ecommerce.thriftauction.features.payment.entity.TransactionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;
    private final AuctionSessionRepository auctionSessionRepository;
    private final AuctionDepositRepository auctionDepositRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(String search, Pageable pageable) {
        Page<Product> products;
        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.findByTitleContainingIgnoreCase(search.trim(), pageable);
        } else {
            products = productRepository.findAll(pageable);
        }

        return products.map(p -> ProductResponse.builder()
                .id(p.getId())
                .sellerId(p.getSeller().getId())
                .sellerName(p.getSeller().getUsername())
                .sellerAvatar(p.getSeller().getAvatar())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .title(p.getTitle())
                .description(p.getDescription())
                .condition(p.getCondition())
                .sellType(p.getSellType())
                .price(p.getPrice())
                .status(p.getStatus())
                .imageUrl(p.getImageUrl())
                .createdAt(p.getCreatedAt())
                .isLive(p.getIsLive())
                .build());
    }

    @Transactional
    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStatus(com.ecommerce.thriftauction.features.product.entity.ProductStatus.HIDDEN);
        productRepository.save(product);
    }

    @Transactional
    public void forceCancelAuction(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getSellType() == com.ecommerce.thriftauction.features.product.entity.SellType.AUCTION) {
            AuctionSession session = auctionSessionRepository.findByProductId(product.getId())
                    .orElse(null);

            if (session != null && session.getStatus() == AuctionStatus.ONGOING) {
                session.setStatus(AuctionStatus.CANCELED);
                auctionSessionRepository.save(session);

                // Refund all deposits
                java.util.List<AuctionDeposit> deposits = auctionDepositRepository
                        .findByAuctionSessionIdAndIsRefundedFalse(session.getId());
                for (AuctionDeposit d : deposits) {
                    walletRepository.findByUserId(d.getUser().getId()).ifPresent(w -> {
                        w.setHeldBalance(w.getHeldBalance().subtract(d.getAmount()));
                        w.setBalance(w.getBalance().add(d.getAmount()));
                        walletRepository.save(w);

                        Transaction tx = Transaction.builder()
                                .wallet(w)
                                .amount(d.getAmount())
                                .type(TransactionType.AUCTION_REFUND)
                                .status(TransactionStatus.COMPLETED)
                                .description("Hủy đấu giá vi phạm & hoàn cọc: " + product.getTitle())
                                .build();
                        transactionRepository.save(tx);

                        d.setRefunded(true);
                        auctionDepositRepository.save(d);
                    });
                }
            }
        }

        product.setStatus(com.ecommerce.thriftauction.features.product.entity.ProductStatus.BANNED);
        product.setIsLive(false);
        productRepository.save(product);
    }
}
