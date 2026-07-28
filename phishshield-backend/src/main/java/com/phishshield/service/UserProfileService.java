package com.phishshield.service;
import com.phishshield.dto.*;
public interface UserProfileService { ProfileResponse getProfile(String email); ProfileResponse updateProfile(String email, UpdateProfileRequest request); void changePassword(String email, ChangePasswordRequest request); }
