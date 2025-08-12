package com.minaobackend.controller;

import com.minaobackend.config.AppProperties;
import com.minaobackend.dto.auth.*;
import com.minaobackend.entity.PasswordResetToken;
import com.minaobackend.entity.User;
import com.minaobackend.exception.BadRequestException;
import com.minaobackend.repository.PasswordResetTokenRepository;
import com.minaobackend.repository.UserRepository;
import com.minaobackend.security.CookieUtils;
import com.minaobackend.security.JwtService;
import com.minaobackend.service.impl.RefreshTokenService;
import com.minaobackend.service.interfaces.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.servlet.http.Cookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;


@Tag(name = "Auth")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final AppProperties appProps;

    public AuthController(UserService userService,
                          UserRepository userRepository,
                          PasswordResetTokenRepository passwordResetTokenRepository,
                          PasswordEncoder passwordEncoder,
                          RefreshTokenService refreshTokenService,
                          JwtService jwtService,
                          AppProperties appProps) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
        this.jwtService = jwtService;
        this.appProps = appProps;
    }

    // helper pour SameSite (prod: None si Secure=true, sinon Lax)
    private String sameSite() {
        return appProps.getAuth().isRefreshCookieSecure() ? "None" : "Lax";
    }

    // --- REGISTER
    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest req) {
        User u = userService.register(req.getFullName(), req.getEmail(), req.getPassword());
        u.setPassword(null);
        return ResponseEntity.ok(u);
    }

    // --- LOGIN: renvoie access token en JSON + place un cookie HttpOnly pour le refresh
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req,
                                              HttpServletResponse response) {
        String accessToken = userService.login(req.getEmail(), req.getPassword());

        // Émettre le refresh token et le mettre en cookie
        User u = userService.me(req.getEmail().trim().toLowerCase());
        String refreshPlain = refreshTokenService.issue(u);
        int maxAge = appProps.getAuth().getRefreshTtlDays() * 24 * 60 * 60;

        CookieUtils.addHttpOnlyCookie(
                response,
                appProps.getAuth().getRefreshCookieName(),     // "rt"
                refreshPlain,
                appProps.getAuth().getRefreshCookieDomain(),   // "localhost" en dev
                appProps.getAuth().isRefreshCookieSecure(),    // false en dev
                maxAge,
                appProps.getAuth().isRefreshCookieSecure() ? "None" : "Lax"
        );

        return ResponseEntity.ok(new AuthResponse(accessToken));
    }


    // --- ME
    @GetMapping("/me")
    public ResponseEntity<User> me(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) throw new BadRequestException("Not authenticated");
        User u = userService.me(principal.getUsername());
        u.setPassword(null);
        return ResponseEntity.ok(u);
    }

    // --- CHANGE PASSWORD (protégé)
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails principal,
                                            @Valid @RequestBody ChangePasswordRequest req) {
        if (principal == null) throw new BadRequestException("Not authenticated");

        User user = userService.me(principal.getUsername());

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(400).body("Current password invalid");
        }
        if (req.getNewPassword() == null || req.getNewPassword().length() < 6) {
            return ResponseEntity.badRequest().body("New password must be >= 6 characters");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.noContent().build();
    }

    // --- FORGOT PASSWORD (public)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgot(@Valid @RequestBody ForgotPasswordRequest req) {
        String email = req.getEmail() == null ? null : req.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);

        // Toujours 204 pour éviter l'énumération d'emails
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            passwordResetTokenRepository.deleteByUserId(user.getId());
            PasswordResetToken prt = PasswordResetToken.builder()
                    .user(user)
                    .token(UUID.randomUUID().toString())
                    .expiresAt(Instant.now().plus(30, ChronoUnit.MINUTES))
                    .build();
            passwordResetTokenRepository.save(prt);
            // TODO: envoyer prt.getToken() par email (lien front: /reset?token=...)
        }
        return ResponseEntity.noContent().build();
    }

    // --- RESET PASSWORD (public)
    @PostMapping("/reset-password")
    public ResponseEntity<?> reset(@Valid @RequestBody ResetPasswordRequest req) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(req.getToken());
        if (!tokenOpt.isPresent() || tokenOpt.get().getExpiresAt().isBefore(Instant.now())) {
            return ResponseEntity.status(400).body("Invalid or expired token");
        }

        PasswordResetToken prt = tokenOpt.get();
        User user = prt.getUser();

        if (req.getNewPassword() == null || req.getNewPassword().length() < 6) {
            return ResponseEntity.badRequest().body("New password must be >= 6 characters");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        passwordResetTokenRepository.delete(prt); // one-time use
        return ResponseEntity.noContent().build();
    }

    // --- REFRESH (via cookie HttpOnly) + rotation stricte
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(HttpServletRequest request,
                                                HttpServletResponse response) {
        String cookieName = appProps.getAuth().getRefreshCookieName();
        String refreshPlain = extractCookie(request, cookieName);
        if (refreshPlain == null || refreshPlain.isEmpty()) {
            CookieUtils.clearCookie(response, cookieName,
                    appProps.getAuth().getRefreshCookieDomain(),
                    appProps.getAuth().isRefreshCookieSecure(),
                    appProps.getAuth().isRefreshCookieSecure() ? "None" : "Lax");
            return ResponseEntity.status(401).build();        // <-- pas 500
        }

        Optional<com.minaobackend.entity.RefreshToken> rtOpt = refreshTokenService.validatePlain(refreshPlain);
        if (!rtOpt.isPresent()) {
            CookieUtils.clearCookie(response, cookieName,
                    appProps.getAuth().getRefreshCookieDomain(),
                    appProps.getAuth().isRefreshCookieSecure(),
                    appProps.getAuth().isRefreshCookieSecure() ? "None" : "Lax");
            return ResponseEntity.status(401).build();
        }

        com.minaobackend.entity.RefreshToken oldRt = rtOpt.get();
        User user = oldRt.getUser();

        // rotation stricte
        refreshTokenService.revoke(oldRt);
        String newRefreshPlain = refreshTokenService.issue(user);
        int maxAge = appProps.getAuth().getRefreshTtlDays() * 24 * 60 * 60;

        CookieUtils.addHttpOnlyCookie(response, cookieName, newRefreshPlain,
                appProps.getAuth().getRefreshCookieDomain(),
                appProps.getAuth().isRefreshCookieSecure(),
                maxAge,
                appProps.getAuth().isRefreshCookieSecure() ? "None" : "Lax");

        Map<String,Object> claims = new java.util.HashMap<String,Object>();
        claims.put("uid", user.getId());
        claims.put("role", user.getRole().name());
        String newAccessToken = jwtService.generateToken(user.getEmail(), claims);

        return ResponseEntity.ok(new AuthResponse(newAccessToken));
    }


    // --- LOGOUT : révoque tous les RT + efface cookie
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails principal,
            HttpServletResponse response
    ) {
        try {
            // Efface le cookie de refresh quoi qu’il arrive
            CookieUtils.clearCookie(
                    response,
                    appProps.getAuth().getRefreshCookieName(),
                    appProps.getAuth().getRefreshCookieDomain(),
                    appProps.getAuth().isRefreshCookieSecure(),
                    sameSite()
            );

            // Si on a un principal valide, tente de révoquer tous ses refresh tokens
            if (principal != null && principal.getUsername() != null) {
                try {
                    User u = userService.me(principal.getUsername());
                    if (u != null && u.getId() != null) {
                        refreshTokenService.revokeAllFor(u); // repo.deleteByUserId(...)
                    }
                } catch (Exception ignored) {
                    // On ignore toute erreur ici: logout doit rester idempotent et 204
                }
            }

            return ResponseEntity.noContent().build(); // 204 toujours

        } catch (Exception e) {
            // En dernier recours, on renvoie quand même 204 (logout best-effort)
            return ResponseEntity.noContent().build();
        }
    }


    private String extractCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie c : cookies) {
            if (name.equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }

}
