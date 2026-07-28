package com.phishshield.mapper;
import com.phishshield.dto.ProfileResponse;
import com.phishshield.entity.User;
import org.springframework.stereotype.Component;
@Component public class UserMapper { public ProfileResponse toProfile(User user) { return new ProfileResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole(), user.getAccountStatus(), user.getCreatedAt(), user.getUpdatedAt()); } }
