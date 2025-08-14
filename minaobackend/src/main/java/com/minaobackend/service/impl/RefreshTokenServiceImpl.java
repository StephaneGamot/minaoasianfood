package com.minaobackend.service.impl;

import com.minaobackend.entity.RefreshToken;
import com.minaobackend.entity.User;
import com.minaobackend.repository.RefreshTokenRepository;
import com.minaobackend.security.TokenCrypto;
import com.minaobackend.service.interfaces.RefreshTokenService;
import com.minaobackend.config.AppProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository repo;
    private final AppProperties appProps;

    @Override
    public String issue(User user) {
        // 32 octets -> ~43 caractères base64url
        String raw = TokenCrypto.generateRandomBase64Url(32);
        String hash = TokenCrypto.sha256Base64Url(raw);

        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setTokenHash(hash); // ton champ mappé sur la colonne "token"
        rt.setRevoked(false);

        int days = Math.max(1, appProps.getAuth().getRefreshTtlDays());
        rt.setExpiresAt(Instant.now().plus(days, ChronoUnit.DAYS));

        repo.save(rt);
        return raw; // on stocke seulement le hash en DB ; le "raw" va dans le cookie HttpOnly
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RefreshToken> validatePlain(String raw) {
        if (raw == null || raw.trim().isEmpty()) return Optional.empty(); // <- sans isBlank
        String hash = TokenCrypto.sha256Base64Url(raw);
        return repo.findByTokenHash(hash)
                .filter(rt -> !rt.isRevoked() && rt.getExpiresAt().isAfter(Instant.now()));
    }

    @Override
    public void revoke(RefreshToken token) {
        if (token == null || token.isRevoked()) return;
        token.setRevoked(true);
        repo.save(token);
    }

    @Override
    public void revokeAllFor(User user) {
        if (user != null && user.getId() != null) {
            repo.revokeAllActiveByUserId(user.getId());
        }
    }

    @Override
    public void revokeAllForUser(Long userId) {
        if (userId != null) {
            repo.revokeAllActiveByUserId(userId);
        }
    }
}
