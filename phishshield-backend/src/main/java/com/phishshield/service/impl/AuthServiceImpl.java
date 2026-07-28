package com.phishshield.service.impl;
import com.phishshield.dto.*;
import com.phishshield.entity.*;
import com.phishshield.exception.ConflictException;
import com.phishshield.exception.UnauthorizedException;
import com.phishshield.repository.RefreshTokenRepository;
import com.phishshield.repository.UserRepository;
import com.phishshield.security.JwtProperties;
import com.phishshield.security.JwtService;
import com.phishshield.service.AuthService;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor @Transactional
public class AuthServiceImpl implements AuthService {
    private final UserRepository users; private final RefreshTokenRepository tokens; private final PasswordEncoder passwordEncoder; private final AuthenticationManager authenticationManager; private final JwtService jwtService; private final JwtProperties jwtProperties;
    @Override public AuthResponse register(RegisterRequest request) { String email=request.email().trim().toLowerCase(); if(users.existsByEmailIgnoreCase(email)) throw new ConflictException("Email is already registered"); User user=new User();user.setFirstName(request.firstName().trim());user.setLastName(request.lastName().trim());user.setEmail(email);user.setPassword(passwordEncoder.encode(request.password()));user=users.save(user);return response(user, issueRefreshToken(user)); }
    @Override public AuthResponse login(LoginRequest request) { try { authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(), request.password())); } catch (AuthenticationException ex) { throw new UnauthorizedException("Invalid email or password"); } User user=users.findByEmailIgnoreCase(request.email().trim()).orElseThrow(() -> new UnauthorizedException("Invalid email or password")); return response(user, issueRefreshToken(user)); }
    @Override public AuthResponse refresh(RefreshTokenRequest request) { RefreshToken token=tokens.findByToken(request.refreshToken()).orElseThrow(() -> new UnauthorizedException("Invalid refresh token")); if(token.isRevoked() || token.getExpiresAt().isBefore(Instant.now()) || token.getUser().getAccountStatus()!=AccountStatus.ACTIVE) throw new UnauthorizedException("Refresh token is expired or revoked"); token.setRevoked(true); return response(token.getUser(), issueRefreshToken(token.getUser())); }
    @Override public void logout(RefreshTokenRequest request) { tokens.findByToken(request.refreshToken()).ifPresent(token -> token.setRevoked(true)); }
    private RefreshToken issueRefreshToken(User user) { RefreshToken token=new RefreshToken();token.setUser(user);token.setToken(UUID.randomUUID().toString());token.setExpiresAt(Instant.now().plusMillis(jwtProperties.refreshExpirationMs()));return tokens.save(token); }
    private AuthResponse response(User user, RefreshToken token) { return new AuthResponse(jwtService.generateAccessToken(user), token.getToken(), "Bearer", jwtProperties.expirationMs()/1000, user.getId(), user.getEmail(), user.getRole().name()); }
}
