package com.ecommerce.thriftauction.config;

import com.ecommerce.thriftauction.entity.Role;
import com.ecommerce.thriftauction.entity.User;
import com.ecommerce.thriftauction.entity.Wallet;
import com.ecommerce.thriftauction.entity.Voucher;
import com.ecommerce.thriftauction.entity.VoucherType;
import com.ecommerce.thriftauction.repository.UserRepository;
import com.ecommerce.thriftauction.repository.WalletRepository;
import com.ecommerce.thriftauction.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final VoucherRepository voucherRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;");
            System.out.println("Dropped transactions_type_check constraint if it existed.");
        } catch (Exception e) {
            System.out.println("Could not drop constraint: " + e.getMessage());
        }

        if (!userRepository.existsByEmail("admin@thrift.com")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@thrift.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .fullName("System Admin")
                    .phone("0383546550")
                    .address("System Address")
                    .build();
            userRepository.save(admin);

            Wallet adminWallet = Wallet.builder()
                    .user(admin)
                    .balance(BigDecimal.ZERO)
                    .heldBalance(BigDecimal.ZERO)
                    .build();
            walletRepository.save(adminWallet);

            System.out.println("Admin account seeded: admin@thrift.com / admin123");
        }

        if (voucherRepository.findByCodeAndIsActiveTrue("WELCOME2026").isEmpty()) {
            Voucher voucher = Voucher.builder()
                    .code("WELCOME2026")
                    .type(VoucherType.FIXED_AMOUNT)
                    .discountValue(new BigDecimal("50000"))
                    .minOrderValue(new BigDecimal("100000"))
                    .quantity(100)
                    .expiryDate(java.time.LocalDateTime.now().plusMonths(1))
                    .isActive(true)
                    .seller(null)
                    .build();
            voucherRepository.save(voucher);
            System.out.println("Platform voucher seeded: WELCOME2026 (50k off for orders >= 100k)");
        }
    }
}
