package com.ecommerce.thriftauction.features.admin.service;

import com.ecommerce.thriftauction.features.payment.dto.TransactionResponse;
import com.ecommerce.thriftauction.features.payment.entity.Transaction;
import com.ecommerce.thriftauction.features.payment.entity.TransactionStatus;
import com.ecommerce.thriftauction.features.payment.entity.TransactionType;
import com.ecommerce.thriftauction.features.payment.entity.Wallet;
import com.ecommerce.thriftauction.features.payment.repository.TransactionRepository;
import com.ecommerce.thriftauction.features.payment.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminWalletService {

    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;

    @Transactional(readOnly = true)
    public BigDecimal getTotalEscrow() {
        BigDecimal total = walletRepository.sumHeldBalance();
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getPendingWithdrawals(String search, Pageable pageable) {
        Page<Transaction> transactions;
        if (search != null && !search.trim().isEmpty()) {
            transactions = transactionRepository.findByTypeAndStatusAndSearch(TransactionType.WITHDRAW,
                    TransactionStatus.PENDING, search.trim(), pageable);
        } else {
            transactions = transactionRepository.findByTypeAndStatusOrderByCreatedAtDesc(
                    TransactionType.WITHDRAW, TransactionStatus.PENDING, pageable);
        }

        return transactions.map(t -> TransactionResponse.builder()
                .id(t.getId())
                .amount(t.getAmount())
                .type(t.getType())
                .status(t.getStatus())
                .description(t.getDescription())
                .username(t.getWallet().getUser().getUsername())
                .walletId(t.getWallet().getId())
                .createdAt(t.getCreatedAt())
                .build());
    }

    @Transactional
    public TransactionResponse approveWithdrawal(String transactionId) {
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (tx.getType() != TransactionType.WITHDRAW || tx.getStatus() != TransactionStatus.PENDING) {
            throw new RuntimeException("Invalid transaction state for approval");
        }

        tx.setStatus(TransactionStatus.COMPLETED);
        transactionRepository.save(tx);

        return TransactionResponse.builder()
                .id(tx.getId())
                .amount(tx.getAmount())
                .type(tx.getType())
                .status(tx.getStatus())
                .description(tx.getDescription())
                .username(tx.getWallet().getUser().getUsername())
                .walletId(tx.getWallet().getId())
                .createdAt(tx.getCreatedAt())
                .build();
    }

    @Transactional
    public TransactionResponse rejectWithdrawal(String transactionId) {
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (tx.getType() != TransactionType.WITHDRAW || tx.getStatus() != TransactionStatus.PENDING) {
            throw new RuntimeException("Invalid transaction state for rejection");
        }

        tx.setStatus(TransactionStatus.CANCELLED);
        transactionRepository.save(tx);

        // Refund the money to the user's wallet
        Wallet wallet = tx.getWallet();
        wallet.setBalance(wallet.getBalance().add(tx.getAmount()));
        walletRepository.save(wallet);

        return TransactionResponse.builder()
                .id(tx.getId())
                .amount(tx.getAmount())
                .type(tx.getType())
                .status(tx.getStatus())
                .description(tx.getDescription())
                .username(tx.getWallet().getUser().getUsername())
                .walletId(tx.getWallet().getId())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
