package com.cloudcostx.controller;

import com.cloudcostx.dto.*;
import com.cloudcostx.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success(authResponse, "Login successful"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserSummaryDto>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        UserSummaryDto userSummary = authService.register(registerRequest);
        return ResponseEntity.ok(ApiResponse.success(userSummary, "User registered successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserSummaryDto>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        UserSummaryDto userSummary = authService.getMe(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(userSummary, "User profile retrieved successfully"));
    }
}
