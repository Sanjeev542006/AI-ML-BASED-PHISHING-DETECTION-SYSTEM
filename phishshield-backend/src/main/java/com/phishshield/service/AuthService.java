package com.phishshield.service;
import com.phishshield.dto.*;
public interface AuthService { AuthResponse register(RegisterRequest request); AuthResponse login(LoginRequest request); AuthResponse refresh(RefreshTokenRequest request); void logout(RefreshTokenRequest request); }
