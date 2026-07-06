package com.ecommerce.thriftauction.service;

import com.ecommerce.thriftauction.dto.AuthRequest;
import com.ecommerce.thriftauction.dto.AuthResponse;
import com.ecommerce.thriftauction.dto.RegisterRequest;
import com.ecommerce.thriftauction.entity.Role;
import com.ecommerce.thriftauction.entity.User;
import com.ecommerce.thriftauction.entity.Wallet;
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

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final WalletRepository walletRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

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

                var jwtToken = jwtService.generateToken(new UserDetailsImpl(savedUser));
                return AuthResponse.builder()
                                .token(jwtToken)
                                .id(savedUser.getId())
                                .username(savedUser.getUsername())
                                .email(savedUser.getEmail())
                                .role(savedUser.getRole().name())
                                .fullName(savedUser.getFullName())
                                .avatar(savedUser.getAvatar())
                                .build();
        }

        public AuthResponse authenticate(AuthRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow();
                var jwtToken = jwtService.generateToken(new UserDetailsImpl(user));
                return AuthResponse.builder()
                                .token(jwtToken)
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .role(user.getRole().name())
                                .fullName(user.getFullName())
                                .avatar(user.getAvatar())
                                .build();
        }

        @Transactional
        public AuthResponse googleLogin(String credential) {
                try {
                        com.google.api.client.http.HttpTransport transport = new com.google.api.client.http.javanet.NetHttpTransport();
                        com.google.api.client.json.JsonFactory jsonFactory = new com.google.api.client.json.gson.GsonFactory();

                        // Using builder and skipping audience check if needed, or set exact audience
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

                                // Find user or create new
                                User user = userRepository.findByEmail(email).orElseGet(() -> {
                                        User newUser = User.builder()
                                                        .username(email.split("@")[0] + "_"
                                                                        + java.util.UUID.randomUUID().toString()
                                                                                        .substring(0, 5))
                                                        .email(email)
                                                        .password(passwordEncoder
                                                                        .encode(java.util.UUID.randomUUID().toString())) // Random
                                                                                                                         // password
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

                                var jwtToken = jwtService.generateToken(new UserDetailsImpl(user));
                                return AuthResponse.builder()
                                                .token(jwtToken)
                                                .id(user.getId())
                                                .username(user.getUsername())
                                                .email(user.getEmail())
                                                .role(user.getRole().name())
                                                .fullName(user.getFullName())
                                                .avatar(user.getAvatar())
                                                .build();
                        } else {
                                throw new RuntimeException("Invalid ID token.");
                        }
                } catch (Exception e) {
                        throw new RuntimeException("Google Login failed: " + e.getMessage());
                }
        }
}
