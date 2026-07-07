package com.ecommerce.thriftauction.controller;

import com.ecommerce.thriftauction.dto.UserResponse;
import com.ecommerce.thriftauction.entity.User;
import com.ecommerce.thriftauction.repository.UserRepository;
import com.ecommerce.thriftauction.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.ecommerce.thriftauction.dto.UserRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Quản lý thông tin người dùng và phân quyền (Bao gồm các tính năng của Admin)")
public class UserController {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        @Operation(summary = "Lấy thông tin cá nhân", description = "Lấy thông tin của người dùng đang đăng nhập.")
        @SecurityRequirement(name = "Bearer Authentication")
        @GetMapping("/me")
        public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
                User user = userRepository.findByEmail(authentication.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return ResponseEntity.ok(mapToResponse(user));
        }

        @Operation(summary = "Lấy hồ sơ người dùng", description = "Xem public profile của một user (dùng cho trang seller).")
        @GetMapping("/profile/{username}")
        public ResponseEntity<UserResponse> getUserProfile(@PathVariable String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return ResponseEntity.ok(mapToResponse(user));
        }

        @Operation(summary = "Lấy danh sách người dùng", description = "Admin lấy danh sách người dùng (ngoại trừ ADMIN).")
        @SecurityRequirement(name = "Bearer Authentication")
        @GetMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<Page<UserResponse>> getAllUsers(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(required = false) String search) {
                Pageable pageable = PageRequest.of(page, size);
                Page<User> users;
                if (search != null && !search.trim().isEmpty()) {
                        users = userRepository.findByRoleNotAndSearch(Role.ADMIN, search.trim(), pageable);
                } else {
                        users = userRepository.findByRoleNot(Role.ADMIN, pageable);
                }
                return ResponseEntity.ok(users.map(this::mapToResponse));
        }

        @Operation(summary = "Cập nhật hồ sơ", description = "Cập nhật thông tin cá nhân của người dùng đang đăng nhập.")
        @SecurityRequirement(name = "Bearer Authentication")
        @PutMapping("/me")
        public ResponseEntity<UserResponse> updateProfile(@RequestBody UserRequest request,
                        Authentication authentication) {
                User user = userRepository.findByEmail(authentication.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                user.setFullName(request.getFullName());
                user.setPhone(request.getPhone());
                user.setAddress(request.getAddress());
                if (request.getAvatar() != null) {
                        user.setAvatar(request.getAvatar());
                }
                if (request.getInterests() != null) {
                        user.setInterests(request.getInterests());
                }
                userRepository.save(user);
                return ResponseEntity.ok(mapToResponse(user));
        }

        @Operation(summary = "Đổi mật khẩu", description = "Đổi mật khẩu khi người dùng đang đăng nhập.")
        @SecurityRequirement(name = "Bearer Authentication")
        @PutMapping("/me/password")
        public ResponseEntity<?> changePassword(
                        @Valid @RequestBody com.ecommerce.thriftauction.dto.ChangePasswordRequest request,
                        Authentication authentication) {
                User user = userRepository.findByEmail(authentication.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                        return ResponseEntity.badRequest().body("Mật khẩu cũ không chính xác.");
                }

                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                userRepository.save(user);
                return ResponseEntity.ok("Đổi mật khẩu thành công.");
        }

        @Operation(summary = "Khóa tài khoản (Ban)", description = "Admin khóa tài khoản người dùng.")
        @SecurityRequirement(name = "Bearer Authentication")
        @PostMapping("/{id}/ban")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<UserResponse> banUser(@PathVariable String id) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                user.setActive(false);
                userRepository.save(user);
                return ResponseEntity.ok(mapToResponse(user));
        }

        @Operation(summary = "Mở khóa tài khoản (Unban)", description = "Admin mở khóa tài khoản người dùng.")
        @SecurityRequirement(name = "Bearer Authentication")
        @PostMapping("/{id}/unban")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<UserResponse> unbanUser(@PathVariable String id) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                user.setActive(true);
                userRepository.save(user);
                return ResponseEntity.ok(mapToResponse(user));
        }

        private UserResponse mapToResponse(User user) {
                return UserResponse.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .phone(user.getPhone())
                                .address(user.getAddress())
                                .avatar(user.getAvatar())
                                .interests(user.getInterests())
                                .role(user.getRole().name())
                                .isActive(user.isActive())
                                .createdAt(user.getCreatedAt())
                                .build();
        }
}
