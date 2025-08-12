package com.minaobackend.service.impl;

import com.minaobackend.entity.RefreshToken;
import com.minaobackend.entity.User;
import com.minaobackend.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository repo;
    private final long ttlDays;

    public RefreshTokenService(RefreshTokenRepository repo,
                               @Value("${app.auth.refresh-ttl-days:7}") long ttlDays) {
        this.repo = repo;
        this.ttlDays = ttlDays;
    }

    /** Émet un nouveau RT: supprime l’ancien, stocke le hash, retourne le token *en clair* (pour cookie). */
    public String issue(User user) {
        // rotation stricte: un seul RT actif/user
        repo.deleteByUserId(user.getId());

        String plain = UUID.randomUUID().toString() + "." + UUID.randomUUID();
        String hash = sha256Hex(plain);

        RefreshToken rt = RefreshToken.builder()
                .user(user)
                .tokenHash(hash)
                .expiresAt(Instant.now().plus(ttlDays, ChronoUnit.DAYS))
                .revoked(false)
                .build();

        repo.save(rt);
        return plain; // à renvoyer dans un cookie HttpOnly
    }

    /** Valide un token en clair: hash → lookup, non révoqué & non expiré. */
    public Optional<RefreshToken> validatePlain(String plainToken) {
        String hash = sha256Hex(plainToken);
        Optional<RefreshToken> rtOpt = repo.findByTokenHash(hash);
        if (!rtOpt.isPresent()) return Optional.empty();

        RefreshToken rt = rtOpt.get();
        if (rt.isRevoked()) return Optional.empty();
        if (rt.getExpiresAt().isBefore(Instant.now())) {
            repo.delete(rt); // nettoyage opportuniste
            return Optional.empty();
        }
        return Optional.of(rt);
    }

    /** Révoque un RT (logout/compromis). */
    public void revoke(RefreshToken token) {
        token.setRevoked(true);
        repo.save(token);
    }

    /** Révoque tous les RT d’un user (logout all). */
    public void revokeAllFor(User user) {
        repo.deleteByUserId(user.getId());
    }

    // --- helpers
    private static String sha256Hex(String s) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] d = md.digest(s.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(d.length * 2);
            for (byte b : d) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
