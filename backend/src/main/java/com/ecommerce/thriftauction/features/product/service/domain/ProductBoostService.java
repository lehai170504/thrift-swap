package com.ecommerce.thriftauction.features.product.service.domain;

import com.ecommerce.thriftauction.features.auth.entity.User;
import com.ecommerce.thriftauction.features.auth.repository.UserRepository;
import com.ecommerce.thriftauction.features.payment.entity.Transaction;
import com.ecommerce.thriftauction.features.payment.entity.TransactionStatus;
import com.ecommerce.thriftauction.features.payment.entity.TransactionType;
import com.ecommerce.thriftauction.features.payment.entity.Wallet;
import com.ecommerce.thriftauction.features.payment.repository.TransactionRepository;
import com.ecommerce.thriftauction.features.payment.repository.WalletRepository;
import com.ecommerce.thriftauction.features.product.dto.ProductResponse;
import com.ecommerce.thriftauction.features.product.entity.Product;
import com.ecommerce.thriftauction.features.product.repository.ProductRepository;
import com.ecommerce.thriftauction.features.product.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ProductBoostService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final ProductMapper productMapper;

    @Transactional
    public ProductResponse boostProduct(String id, String username) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User currentUser = userRepository.findByEmail(username)
                .or(() -> userRepository.findByUsername(username))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!product.getSeller().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not authorized to boost this product");
        }

        Wallet wallet = walletRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        BigDecimal boostFee = new BigDecimal("20000"); // 20k per day
        if (wallet.getBalance().compareTo(boostFee) < 0) {
            throw new RuntimeException("Insufficient balance to boost product. Fee is 20,000 VND.");
        }

        wallet.setBalance(wallet.getBalance().subtract(boostFee));
        walletRepository.save(wallet);

        if (product.getBoostedUntil() == null
                || product.getBoostedUntil().isBefore(java.time.LocalDateTime.now())) {
            product.setBoostedUntil(java.time.LocalDateTime.now().plusDays(1));
        } else {
            product.setBoostedUntil(product.getBoostedUntil().plusDays(1));
        }
        productRepository.save(product);

        Transaction tx = Transaction.builder()
                .wallet(wallet)
                .amount(boostFee)
                .type(TransactionType.BOOST_FEE)
                .status(TransactionStatus.COMPLETED)
                .build();
        transactionRepository.save(tx);

        // Transfer fee to admin wallet
        userRepository.findByRole(com.ecommerce.thriftauction.features.auth.entity.Role.ADMIN).stream()
                .findFirst()
                .ifPresent(admin -> {
                    Wallet adminWallet = walletRepository.findByUserId(admin.getId()).orElse(null);
                    if (adminWallet != null) {
                        adminWallet.setBalance(adminWallet.getBalance().add(boostFee));
                        walletRepository.save(adminWallet);
                    }
                });

        return productMapper.mapToResponse(product);
    }
}
