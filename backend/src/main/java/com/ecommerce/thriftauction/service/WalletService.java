package com.ecommerce.thriftauction.service;

import com.ecommerce.thriftauction.dto.DepositRequest;
import com.ecommerce.thriftauction.dto.TransactionResponse;
import com.ecommerce.thriftauction.dto.WalletResponse;
import com.ecommerce.thriftauction.entity.Transaction;
import com.ecommerce.thriftauction.entity.TransactionStatus;
import com.ecommerce.thriftauction.entity.TransactionType;
import com.ecommerce.thriftauction.entity.User;
import com.ecommerce.thriftauction.entity.Wallet;
import com.ecommerce.thriftauction.repository.TransactionRepository;
import com.ecommerce.thriftauction.repository.UserRepository;
import com.ecommerce.thriftauction.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletService {

        private final WalletRepository walletRepository;
        private final TransactionRepository transactionRepository;
        private final UserRepository userRepository;

        @Transactional(readOnly = true)
        public WalletResponse getMyWallet(String username) {
                User user = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Wallet wallet = walletRepository.findByUserId(user.getId())
                                .orElseGet(() -> {
                                        Wallet newWallet = Wallet.builder()
                                                        .user(user)
                                                        .balance(BigDecimal.ZERO)
                                                        .heldBalance(BigDecimal.ZERO)
                                                        .build();
                                        return walletRepository.save(newWallet);
                                });

                List<Transaction> transactions = transactionRepository
                                .findByWalletIdOrderByCreatedAtDesc(wallet.getId());

                List<TransactionResponse> recentTransactions = transactions.stream()
                                .map(t -> TransactionResponse.builder()
                                                .id(t.getId())
                                                .amount(t.getAmount())
                                                .type(t.getType())
                                                .status(t.getStatus())
                                                .description(t.getDescription())
                                                .username(t.getWallet().getUser().getUsername())
                                                .walletId(t.getWallet().getId())
                                                .createdAt(t.getCreatedAt())
                                                .build())
                                .collect(Collectors.toList());

                return WalletResponse.builder()
                                .id(wallet.getId())
                                .balance(wallet.getBalance() != null ? wallet.getBalance() : BigDecimal.ZERO)
                                .heldBalance(wallet.getHeldBalance() != null ? wallet.getHeldBalance()
                                                : BigDecimal.ZERO)
                                .recentTransactions(recentTransactions)
                                .build();
        }

        @Transactional
        public WalletResponse deposit(String username, DepositRequest request) {
                User user = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Wallet wallet = walletRepository.findByUserId(user.getId())
                                .orElseGet(() -> {
                                        Wallet newWallet = Wallet.builder()
                                                        .user(user)
                                                        .balance(BigDecimal.ZERO)
                                                        .heldBalance(BigDecimal.ZERO)
                                                        .build();
                                        return walletRepository.save(newWallet);
                                });

                if (request.getAmount() == null || request.getAmount().signum() <= 0) {
                        throw new RuntimeException("Deposit amount must be greater than zero");
                }

                // Add to balance
                wallet.setBalance(wallet.getBalance().add(request.getAmount()));
                walletRepository.save(wallet);

                // Record transaction
                Transaction tx = Transaction.builder()
                                .wallet(wallet)
                                .amount(request.getAmount())
                                .type(TransactionType.DEPOSIT)
                                .status(TransactionStatus.COMPLETED)
                                .build();
                transactionRepository.save(tx);

                return getMyWallet(username);
        }

        @Transactional
        public WalletResponse requestWithdraw(String username,
                        com.ecommerce.thriftauction.dto.WithdrawRequest request) {
                User user = userRepository.findByEmail(username)
                                .or(() -> userRepository.findByUsername(username))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Wallet wallet = walletRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Wallet not found"));

                if (request.getAmount() == null || request.getAmount().signum() <= 0) {
                        throw new RuntimeException("Withdraw amount must be greater than zero");
                }

                if (wallet.getBalance().compareTo(request.getAmount()) < 0) {
                        throw new RuntimeException("Insufficient balance");
                }

                // Deduct from balance
                wallet.setBalance(wallet.getBalance().subtract(request.getAmount()));
                walletRepository.save(wallet);

                String description = String.format("Ngân hàng: %s | STK: %s | Tên: %s",
                                request.getBankName(), request.getAccountNumber(), request.getAccountName());

                // Record transaction
                Transaction tx = Transaction.builder()
                                .wallet(wallet)
                                .amount(request.getAmount())
                                .type(TransactionType.WITHDRAW)
                                .status(TransactionStatus.PENDING)
                                .description(description)
                                .build();
                transactionRepository.save(tx);

                return getMyWallet(username);
        }
}
