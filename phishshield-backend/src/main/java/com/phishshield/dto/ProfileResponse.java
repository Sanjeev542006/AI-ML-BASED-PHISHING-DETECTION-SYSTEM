package com.phishshield.dto;
import com.phishshield.entity.AccountStatus;
import com.phishshield.entity.Role;
import java.time.Instant;
import java.util.UUID;
public record ProfileResponse(UUID id, String firstName, String lastName, String email, Role role, AccountStatus accountStatus, Instant createdAt, Instant updatedAt) { }
