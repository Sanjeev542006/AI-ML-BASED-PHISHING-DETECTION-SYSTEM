package com.phishshield.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Table(name = "users") @Getter @Setter @NoArgsConstructor
public class User extends BaseEntity {
    @Column(name = "first_name", nullable = false, length = 100) private String firstName;
    @Column(name = "last_name", nullable = false, length = 100) private String lastName;
    @Column(nullable = false, unique = true, length = 255) private String email;
    @Column(nullable = false) private String password;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private Role role = Role.USER;
    @Enumerated(EnumType.STRING) @Column(name = "account_status", nullable = false, length = 30) private AccountStatus accountStatus = AccountStatus.ACTIVE;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true) private List<RefreshToken> refreshTokens = new ArrayList<>();
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true) private List<ScanHistory> scans = new ArrayList<>();
}
