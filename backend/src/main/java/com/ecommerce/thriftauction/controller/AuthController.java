package com.ecommerce.thriftauction.controller;

import com.ecommerce.thriftauction.dto.AuthRequest;
import com.ecommerce.thriftauction.dto.AuthResponse;
import com.ecommerce.thriftauction.dto.RegisterRequest;
import com.ecommerce.thriftauction.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints cho đăng ký, đăng nhập và quản lý phiên làm việc")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Đăng ký tài khoản", description = "Tạo một tài khoản người dùng mới.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng ký thành công", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ")
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request, HttpServletResponse response) {
        AuthResponse res = authService.register(request);
        setTokenCookie(response, res.getToken());
        return ResponseEntity.ok(res);
    }

    @Operation(summary = "Đăng nhập", description = "Xác thực người dùng và trả về JWT token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "401", description = "Sai email hoặc mật khẩu"),
            @ApiResponse(responseCode = "403", description = "Tài khoản bị khóa")
    })
    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody AuthRequest request, HttpServletResponse response) {
        try {
            AuthResponse res = authService.authenticate(request);
            setTokenCookie(response, res.getToken());
            return ResponseEntity.ok(res);
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Email hoặc mật khẩu không đúng.");
        }
    }

    @Operation(summary = "Đăng nhập bằng Google", description = "Xác thực người dùng qua Google OAuth2.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "401", description = "Xác thực Google thất bại")
    })
    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody com.ecommerce.thriftauction.dto.GoogleLoginRequest request,
            HttpServletResponse response) {
        try {
            AuthResponse res = authService.googleLogin(request.getCredential());
            setTokenCookie(response, res.getToken());
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    @Operation(summary = "Đăng xuất", description = "Xóa cookie JWT token.")
    @ApiResponse(responseCode = "200", description = "Đăng xuất thành công")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    private void setTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        response.addCookie(cookie);
    }
}
