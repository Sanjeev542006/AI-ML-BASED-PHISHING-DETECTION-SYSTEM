package com.phishshield.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Table(name = "refresh_tokens") @Getter @Setter @NoArgsConstructor
public class RefreshToken extends BaseEntity {
    @Column(nullable = false, unique = true, length = 255) private String token;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(name = "expires_at", nullable = false) private Instant expiresAt;
    @Column(nullable = false) private boolean revoked;
}
