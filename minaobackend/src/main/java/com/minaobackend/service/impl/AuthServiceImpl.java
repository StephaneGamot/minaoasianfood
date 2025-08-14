// src/main/java/com/minaobackend/service/impl/AuthServiceImpl.java
package com.minaobackend.service.impl;

import com.minaobackend.dto.auth.AuthResponse;
import com.minaobackend.entity.RefreshToken;
import com.minaobackend.exception.BadRequestException;
import com.minaobackend.repository.RefreshTokenRepository;
import com.minaobackend.repository.UserRepository;
import com.minaobackend.security.JwtService;
import com.minaobackend.service.interfaces.AuthService;              // <-- bon package
import com.minaobackend.service.interfaces.RefreshTokenService;    // <-- bon package
import lombok.RequiredArgsConstructor;
import lombok.var;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;   // utilisé pour révoquer le RT consommé
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;         // issue(), validatePlain(), revokeAllForUser()
    private final JwtService jwtService;

    @Override
    @Transactional
    public AuthResponse login(String email, String rawPassword) {
        final var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        // 1) On révoque tous les refresh tokens actifs de l’utilisateur
        refreshTokenService.revokeAllForUser(user.getId());

        // 2) On retourne uniquement l’access token (le controller fera issue(user) + cookie)
        final String access = jwtService.generateAccessToken(user);
        return new AuthResponse(access);
    }

    @Override
    @Transactional
    public AuthResponse refresh(String refreshPlain) {
        if (refreshPlain == null || refreshPlain.trim().isEmpty()) {
            throw new BadRequestException("Invalid refresh");
        }

        // 1) Valider le refresh "brut" (hash + lookup + vérifs)
        final RefreshToken rt = refreshTokenService.validatePlain(refreshPlain)
                .orElseThrow(() -> new BadRequestException("Invalid refresh"));

        // 2) Révoquer le refresh token consommé (rotation)
        rt.setRevoked(true);
        refreshTokenRepository.save(rt);

        // 3) Générer un nouvel access token (le controller fera issue(user) + cookie pour le nouveau RT)
        final String access = jwtService.generateAccessToken(rt.getUser());
        return new AuthResponse(access);
    }
}
