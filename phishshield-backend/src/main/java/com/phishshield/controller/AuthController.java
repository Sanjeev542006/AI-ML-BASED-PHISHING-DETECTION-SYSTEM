package com.phishshield.controller;
import com.phishshield.dto.*;
import com.phishshield.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/register") public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(authService.register(request), "User registered")); }
    @PostMapping("/login") public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) { return ApiResponse.success(authService.login(request)); }
    @PostMapping("/refresh") public ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) { return ApiResponse.success(authService.refresh(request)); }
    @PostMapping("/logout") @ResponseStatus(HttpStatus.NO_CONTENT) public void logout(@Valid @RequestBody RefreshTokenRequest request) { authService.logout(request); }
}
