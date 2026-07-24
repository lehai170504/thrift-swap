package com.ecommerce.thriftauction.core.config;

import com.ecommerce.thriftauction.features.auth.entity.Role;
import com.ecommerce.thriftauction.features.auth.entity.User;
import com.ecommerce.thriftauction.features.payment.entity.Wallet;
import com.ecommerce.thriftauction.features.voucher.entity.Voucher;
import com.ecommerce.thriftauction.features.voucher.entity.VoucherType;
import com.ecommerce.thriftauction.features.auth.repository.UserRepository;
import com.ecommerce.thriftauction.features.payment.repository.WalletRepository;
import com.ecommerce.thriftauction.features.voucher.repository.VoucherRepository;
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

    @org.springframework.beans.factory.annotation.Value("${app.admin.email}")
    private String adminEmail;

    @org.springframework.beans.factory.annotation.Value("${app.admin.password}")
    private String adminPassword;

    @org.springframework.beans.factory.annotation.Value("${app.staff.email}")
    private String staffEmail;

    @org.springframework.beans.factory.annotation.Value("${app.staff.password}")
    private String staffPassword;

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;");
            jdbcTemplate.execute("ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;");
            jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;");
            System.out.println("Dropped constraints if they existed.");
        } catch (Exception e) {
            System.out.println("Could not drop constraint: " + e.getMessage());
        }

        userRepository.findByEmail(adminEmail).ifPresentOrElse(admin -> {
            admin.setRole(Role.ADMIN);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            userRepository.save(admin);
            System.out.println("Admin account updated: " + adminEmail);
        }, () -> {
            String adminUsername = adminEmail.split("@")[0];
            if (userRepository.existsByUsername(adminUsername)) {
                adminUsername += "_" + java.util.UUID.randomUUID().toString().substring(0, 4);
            }
            User admin = User.builder()
                    .username(adminUsername)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
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

            System.out.println("Admin account seeded: " + adminEmail);
        });

        userRepository.findByEmail(staffEmail).ifPresentOrElse(staff -> {
            staff.setRole(Role.STAFF);
            staff.setPassword(passwordEncoder.encode(staffPassword));
            userRepository.save(staff);
            System.out.println("Staff account updated: " + staffEmail);
        }, () -> {
            String staffUsername = staffEmail.split("@")[0];
            if (userRepository.existsByUsername(staffUsername)) {
                staffUsername += "_" + java.util.UUID.randomUUID().toString().substring(0, 4);
            }
            User staff = User.builder()
                    .username(staffUsername)
                    .email(staffEmail)
                    .password(passwordEncoder.encode(staffPassword))
                    .role(Role.STAFF)
                    .fullName("System Staff")
                    .phone("0987654321")
                    .address("Staff Address")
                    .build();
            userRepository.save(staff);

            Wallet staffWallet = Wallet.builder()
                    .user(staff)
                    .balance(BigDecimal.ZERO)
                    .heldBalance(BigDecimal.ZERO)
                    .build();
            walletRepository.save(staffWallet);

            System.out.println("Staff account seeded: " + staffEmail);
        });

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
