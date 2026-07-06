package com.ecommerce.thriftauction.controller;

import com.ecommerce.thriftauction.dto.DepositRequest;
import com.ecommerce.thriftauction.dto.WalletResponse;
import com.ecommerce.thriftauction.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/wallets")
@RequiredArgsConstructor
@Tag(name = "Wallet", description = "Quản lý ví điện tử của người dùng: Nạp tiền, Rút tiền, Số dư")
public class WalletController {

    private final WalletService walletService;

    @Operation(summary = "Xem thông tin ví", description = "Lấy số dư hiện tại và lịch sử giao dịch của user.")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/me")
    public ResponseEntity<WalletResponse> getMyWallet(Authentication authentication) {
        return ResponseEntity.ok(walletService.getMyWallet(authentication.getName()));
    }

    @Operation(summary = "Nạp tiền (Test/Manual)", description = "Nạp tiền thủ công vào ví (Thường dùng cho Dev/Test).")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/deposit")
    public ResponseEntity<WalletResponse> deposit(@RequestBody DepositRequest request, Authentication authentication) {
        return ResponseEntity.ok(walletService.deposit(authentication.getName(), request));
    }

    @Operation(summary = "Yêu cầu rút tiền", description = "Gửi yêu cầu rút tiền từ ví ra tài khoản ngân hàng. Tiền sẽ bị trừ tạm thời chờ Admin duyệt.")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/withdraw")
    public ResponseEntity<WalletResponse> requestWithdraw(
            @RequestBody com.ecommerce.thriftauction.dto.WithdrawRequest request, Authentication authentication) {
        return ResponseEntity.ok(walletService.requestWithdraw(authentication.getName(), request));
    }
}
