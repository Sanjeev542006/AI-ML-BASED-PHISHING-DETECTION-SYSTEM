package com.phishshield.service.impl;
import com.phishshield.dto.*;
import com.phishshield.entity.User;
import com.phishshield.exception.ConflictException;
import com.phishshield.exception.ResourceNotFoundException;
import com.phishshield.exception.UnauthorizedException;
import com.phishshield.mapper.UserMapper;
import com.phishshield.repository.RefreshTokenRepository;
import com.phishshield.repository.UserRepository;
import com.phishshield.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor @Transactional
public class UserProfileServiceImpl implements UserProfileService {
    private final UserRepository users; private final RefreshTokenRepository refreshTokens; private final UserMapper mapper; private final PasswordEncoder passwordEncoder;
    @Override @Transactional(readOnly=true) public ProfileResponse getProfile(String email) { return mapper.toProfile(current(email)); }
    @Override public ProfileResponse updateProfile(String email, UpdateProfileRequest request) { User user=current(email);String updatedEmail=request.email().trim().toLowerCase();if(!user.getEmail().equalsIgnoreCase(updatedEmail)&&users.existsByEmailIgnoreCase(updatedEmail))throw new ConflictException("Email is already registered");user.setFirstName(request.firstName().trim());user.setLastName(request.lastName().trim());user.setEmail(updatedEmail);return mapper.toProfile(user); }
    @Override public void changePassword(String email, ChangePasswordRequest request) { User user=current(email);if(!passwordEncoder.matches(request.currentPassword(),user.getPassword()))throw new UnauthorizedException("Current password is incorrect");if(passwordEncoder.matches(request.newPassword(),user.getPassword()))throw new ConflictException("New password must differ from the current password");user.setPassword(passwordEncoder.encode(request.newPassword()));refreshTokens.deleteByUser(user); }
    private User current(String email) { return users.findByEmailIgnoreCase(email).orElseThrow(() -> new ResourceNotFoundException("User not found")); }
}
