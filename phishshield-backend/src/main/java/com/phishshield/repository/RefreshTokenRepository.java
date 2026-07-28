package com.phishshield.repository;
import com.phishshield.entity.RefreshToken;
import com.phishshield.entity.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> { Optional<RefreshToken> findByToken(String token); void deleteByUser(User user); }
