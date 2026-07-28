package com.phishshield.controller;
import com.phishshield.dto.*;
import com.phishshield.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/user") @RequiredArgsConstructor
public class UserController {
    private final UserProfileService userProfileService;
    @GetMapping("/profile") public ApiResponse<ProfileResponse> profile(@AuthenticationPrincipal(expression="username") String email) { return ApiResponse.success(userProfileService.getProfile(email)); }
    @PutMapping("/profile") public ApiResponse<ProfileResponse> updateProfile(@AuthenticationPrincipal(expression="username") String email, @Valid @RequestBody UpdateProfileRequest request) { return ApiResponse.success(userProfileService.updateProfile(email, request)); }
    @PutMapping("/password") @ResponseStatus(HttpStatus.NO_CONTENT) public void changePassword(@AuthenticationPrincipal(expression="username") String email, @Valid @RequestBody ChangePasswordRequest request) { userProfileService.changePassword(email, request); }
}
