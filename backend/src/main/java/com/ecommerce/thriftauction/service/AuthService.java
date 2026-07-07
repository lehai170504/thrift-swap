package com.ecommerce.thriftauction.service;

import com.ecommerce.thriftauction.dto.AuthRequest;
import com.ecommerce.thriftauction.dto.AuthResponse;
import com.ecommerce.thriftauction.dto.RegisterRequest;
import com.ecommerce.thriftauction.dto.ResetPasswordRequest;
import com.ecommerce.thriftauction.entity.OtpToken;
import com.ecommerce.thriftauction.entity.RefreshToken;
import com.ecommerce.thriftauction.entity.Role;
import com.ecommerce.thriftauction.entity.User;
import com.ecommerce.thriftauction.entity.Wallet;
import com.ecommerce.thriftauction.repository.OtpTokenRepository;
import com.ecommerce.thriftauction.repository.RefreshTokenRepository;
import com.ecommerce.thriftauction.repository.UserRepository;
import com.ecommerce.thriftauction.repository.WalletRepository;
import com.ecommerce.thriftauction.security.JwtService;
import com.ecommerce.thriftauction.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final WalletRepository walletRepository;
        private final RefreshTokenRepository refreshTokenRepository;
        private final OtpTokenRepository otpTokenRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final EmailService emailService;

        @org.springframework.beans.factory.annotation.Value("${google.client.id}")
        private String googleClientId;

        @Transactional
        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByUsername(request.getUsername())) {
                        throw new RuntimeException("Username is already taken!");
                }
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email is already taken!");
                }

                var user = User.builder()
                                .username(request.getUsername())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .fullName(request.getFullName())
                                .phone(request.getPhone())
                                .address(request.getAddress())
                                .interests(request.getInterests())
                                .role(Role.USER)
                                .isActive(true)
                                .build();

                var savedUser = userRepository.save(user);

                var wallet = Wallet.builder()
                                .user(savedUser)
                                .balance(BigDecimal.ZERO)
                                .build();
                walletRepository.save(wallet);

                return buildAuthResponse(savedUser);
        }

        public AuthResponse authenticate(AuthRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow();

                return buildAuthResponse(user);
        }

        @Transactional
        public AuthResponse googleLogin(String credential) {
                try {
                        com.google.api.client.http.HttpTransport transport = new com.google.api.client.http.javanet.NetHttpTransport();
                        com.google.api.client.json.JsonFactory jsonFactory = new com.google.api.client.json.gson.GsonFactory();

                        com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier verifier = new com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier.Builder(
                                        transport, jsonFactory)
                                        .setAudience(java.util.Collections.singletonList(googleClientId))
                                        .build();

                        com.google.api.client.googleapis.auth.oauth2.GoogleIdToken idToken = verifier
                                        .verify(credential);
                        if (idToken != null) {
                                com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload payload = idToken
                                                .getPayload();
                                String email = payload.getEmail();
                                String name = (String) payload.get("name");
                                String pictureUrl = (String) payload.get("picture");

                                User user = userRepository.findByEmail(email).orElseGet(() -> {
                                        User newUser = User.builder()
                                                        .username(email.split("@")[0] + "_"
                                                                        + java.util.UUID.randomUUID().toString()
                                                                                        .substring(0, 5))
                                                        .email(email)
                                                        .password(passwordEncoder
                                                                        .encode(java.util.UUID.randomUUID().toString()))
                                                        .fullName(name)
                                                        .avatar(pictureUrl)
                                                        .role(Role.USER)
                                                        .isActive(true)
                                                        .build();
                                        User saved = userRepository.save(newUser);
                                        Wallet wallet = Wallet.builder()
                                                        .user(saved)
                                                        .balance(BigDecimal.ZERO)
                                                        .build();
                                        walletRepository.save(wallet);
                                        return saved;
                                });

                                return buildAuthResponse(user);
                        } else {
                                throw new RuntimeException("Invalid ID token.");
                        }
                } catch (Exception e) {
                        throw new RuntimeException("Google Login failed: " + e.getMessage());
                }
        }

        @Transactional
        public AuthResponse refreshToken(String token) {
                RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                                .orElseThrow(() -> new RuntimeException("Refresh Token is not found!"));

                if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                        refreshTokenRepository.delete(refreshToken);
                        throw new RuntimeException("Refresh token was expired. Please make a new signin request");
                }

                User user = refreshToken.getUser();
                String accessToken = jwtService.generateToken(new UserDetailsImpl(user));

                return buildAuthResponseWithExistingRefreshToken(user, accessToken, refreshToken.getToken());
        }

        @Transactional
        public void forgotPassword(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

                // Generate 6-digit OTP
                String otp = String.format("%06d", new Random().nextInt(999999));

                OtpToken otpToken = OtpToken.builder()
                                .user(user)
                                .otp(otp)
                                .expiryDate(LocalDateTime.now().plusMinutes(15))
                                .build();

                otpTokenRepository.save(otpToken);

                emailService.sendOtpEmail(user.getEmail(), otp);
        }

        @Transactional
        public void resetPassword(ResetPasswordRequest request) {
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                OtpToken otpToken = otpTokenRepository.findByOtpAndUser(request.getOtp(), user)
                                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

                if (otpToken.isUsed()) {
                        throw new RuntimeException("OTP has already been used");
                }

                if (otpToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                        throw new RuntimeException("OTP has expired");
                }

                // Update password
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                userRepository.save(user);

                // Mark OTP as used
                otpToken.setUsed(true);
                otpTokenRepository.save(otpToken);

                // Optional: delete all refresh tokens to force re-login on all devices
                refreshTokenRepository.deleteByUser(user);
        }

        private RefreshToken createRefreshToken(User user) {
                RefreshToken refreshToken = RefreshToken.builder()
                                .user(user)
                                .token(UUID.randomUUID().toString())
                                .expiryDate(LocalDateTime.now().plusDays(7))
                                .build();
                return refreshTokenRepository.save(refreshToken);
        }

        private AuthResponse buildAuthResponse(User user) {
                var jwtToken = jwtService.generateToken(new UserDetailsImpl(user));
                var refreshToken = createRefreshToken(user);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .refreshToken(refreshToken.getToken())
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .role(user.getRole().name())
                                .fullName(user.getFullName())
                                .avatar(user.getAvatar())
                                .phone(user.getPhone())
                                .address(user.getAddress())
                                .interests(user.getInterests())
                                .build();
        }

        private AuthResponse buildAuthResponseWithExistingRefreshToken(User user, String accessToken,
                        String refreshTokenStr) {
                return AuthResponse.builder()
                                .token(accessToken)
                                .refreshToken(refreshTokenStr)
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .role(user.getRole().name())
                                .fullName(user.getFullName())
                                .avatar(user.getAvatar())
                                .phone(user.getPhone())
                                .address(user.getAddress())
                                .interests(user.getInterests())
                                .build();
        }
}
