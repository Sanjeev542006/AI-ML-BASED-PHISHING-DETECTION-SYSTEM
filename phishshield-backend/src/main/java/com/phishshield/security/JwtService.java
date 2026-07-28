package com.phishshield.security;
import com.phishshield.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class JwtService {
    private final JwtProperties properties;
    public String generateAccessToken(User user) { return Jwts.builder().subject(user.getEmail()).claim("role", user.getRole().name()).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+properties.expirationMs())).signWith(key()).compact(); }
    public String extractEmail(String token) { return claims(token).getSubject(); }
    public boolean isValid(String token, User user) { try { return user.getEmail().equalsIgnoreCase(extractEmail(token)) && claims(token).getExpiration().after(new Date()); } catch (RuntimeException ex) { return false; } }
    private Claims claims(String token) { return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload(); }
    private SecretKey key() { return Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8)); }
}
