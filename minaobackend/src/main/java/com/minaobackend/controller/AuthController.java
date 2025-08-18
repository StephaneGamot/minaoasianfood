package com.minaobackend.controller;

import com.minaobackend.config.AppProperties;
import com.minaobackend.dto.auth.AuthResponse;
import com.minaobackend.dto.auth.ChangePasswordRequest;
import com.minaobackend.dto.auth.ForgotPasswordRequest;
import com.minaobackend.dto.auth.LoginRequest;
import com.minaobackend.dto.auth.RegisterRequest;
import com.minaobackend.dto.auth.ResetPasswordRequest;
import com.minaobackend.dto.user.UpdateProfileRequest;
import com.minaobackend.dto.user.UserProfileDto;
import com.minaobackend.entity.PasswordResetToken;
import com.minaobackend.entity.RefreshToken;
import com.minaobackend.entity.User;
import com.minaobackend.exception.BadRequestException;
import com.minaobackend.repository.PasswordResetTokenRepository;
import com.minaobackend.repository.UserRepository;
import com.minaobackend.security.CookieUtils;
import com.minaobackend.security.JwtService;
import com.minaobackend.service.interfaces.RefreshTokenService;
import com.minaobackend.service.interfaces.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
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

    private String sameSite() {
        return appProps.getAuth().isRefreshCookieSecure() ? "None" : "Lax";
    }

    /* ---------------- REGISTER ---------------- */
    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest req) {
        User u = userService.register(req.getLastName(), req.getEmail(), req.getPassword());
        u.setPassword(null);
        return ResponseEntity.ok(u);
    }

    /* ---------------- LOGIN ---------------- */
    // Renvoie un accessToken en JSON + dépose un cookie HttpOnly de refresh
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req,
                                              HttpServletResponse response) {
        String accessToken = userService.login(req.getEmail(), req.getPassword());

        User u = userService.me(req.getEmail().trim().toLowerCase());
        String refreshPlain = refreshTokenService.issue(u);
        int maxAge = appProps.getAuth().getRefreshTtlDays() * 24 * 60 * 60;

        CookieUtils.addHttpOnlyCookie(
                response,
                appProps.getAuth().getRefreshCookieName(),          // ex: "rt"
                refreshPlain,
                appProps.getAuth().getRefreshCookieDomain(),        // "" en dev (pas "localhost")
                appProps.getAuth().isRefreshCookieSecure(),         // false en dev
                maxAge,
                sameSite()
        );

        return ResponseEntity.ok(new AuthResponse(accessToken));
    }

    /* ---------------- ME (GET) ---------------- */
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> me(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) throw new BadRequestException("Not authenticated");
        User u = userService.me(principal.getUsername());
        return ResponseEntity.ok(toDto(u));
    }

    /* ---------------- ME (PUT) ---------------- */
    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateMe(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails principal,
            @RequestBody UpdateProfileRequest req
    ) {
        if (principal == null) throw new BadRequestException("Not authenticated");
        User updated = userService.updateMe(principal.getUsername(), req); // ✅
        updated.setPassword(null);
        return ResponseEntity.ok(toDto(updated));
    }


    private static UserProfileDto toDto(User u) {
        UserProfileDto dto = new UserProfileDto();
        dto.id = u.getId();
        dto.firstName = u.getFirstName();
        dto.lastName = u.getLastName();
        dto.email = u.getEmail();
        dto.address = u.getAddress();
        dto.address2 = u.getAddress2();
        dto.city = u.getCity();
        dto.postalCode = u.getPostalCode();
        dto.phoneNumber = u.getPhoneNumber();
        dto.gender = u.getGender();
        dto.profilePicUrl = u.getProfilePicUrl();
        dto.role = u.getRole();
        dto.active = u.isActive();
        dto.createdAt = u.getCreatedAt();
        dto.updatedAt = u.getUpdatedAt();
        dto.preferences = u.getPreferences();
        return dto;
    }

    @PostMapping(value = "/me/avatar", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserProfileDto> uploadAvatar(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails principal,
            @RequestPart("file") org.springframework.web.multipart.MultipartFile file
    ) throws java.io.IOException {
        if (principal == null) throw new BadRequestException("Not authenticated");
        if (file == null || file.isEmpty()) return ResponseEntity.badRequest().build();

        String original = file.getOriginalFilename();
        String ext = (original != null && original.contains("."))
                ? original.substring(original.lastIndexOf('.') + 1).toLowerCase()
                : "jpg";
        java.util.List<String> allowed = java.util.Arrays.asList("jpg","jpeg","png","webp");
        if (!allowed.contains(ext)) {
            return ResponseEntity.badRequest().build();
        }

        String uploadRoot = System.getProperty("user.dir") + "/uploads/avatars";
        java.nio.file.Files.createDirectories(java.nio.file.Path.of(uploadRoot));

        String filename = java.util.UUID.randomUUID() + "." + ext;
        java.nio.file.Path dest = java.nio.file.Path.of(uploadRoot, filename);
        java.nio.file.Files.copy(file.getInputStream(), dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

        String publicUrl = "/uploads/avatars/" + filename;

        User updated = userService.updateProfilePic(principal.getUsername(), publicUrl);
        updated.setPassword(null);
        return ResponseEntity.ok(toDto(updated));
    }
    /* ---------------- CHANGE PASSWORD ---------------- */
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

    /* ---------------- FORGOT PASSWORD ---------------- */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgot(@Valid @RequestBody ForgotPasswordRequest req) {
        String email = req.getEmail() == null ? null : req.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);

        // Toujours 204 (pas d’énumération d’emails)
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            passwordResetTokenRepository.deleteByUserId(user.getId());
            PasswordResetToken prt = PasswordResetToken.builder()
                    .user(user)
                    .token(UUID.randomUUID().toString())
                    .expiresAt(Instant.now().plus(30, ChronoUnit.MINUTES))
                    .build();
            passwordResetTokenRepository.save(prt);
            // TODO: envoyer l'email avec le lien de reset contenant prt.getToken()
        }
        return ResponseEntity.noContent().build();
    }

    /* ---------------- RESET PASSWORD ---------------- */
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

    /* ---------------- REFRESH ---------------- */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(HttpServletRequest request,
                                                HttpServletResponse response) {
        final String cookieName = appProps.getAuth().getRefreshCookieName(); // ex: "rt"
        final String refreshPlain = extractCookie(request, cookieName);

        // Pas de cookie => 401 + clear côté client
        if (refreshPlain == null || refreshPlain.trim().isEmpty()) {
            CookieUtils.clearCookie(
                    response, cookieName,
                    appProps.getAuth().getRefreshCookieDomain(),
                    appProps.getAuth().isRefreshCookieSecure(),
                    sameSite()
            );
            return ResponseEntity.status(401).build();
        }

        Optional<RefreshToken> rtOpt = refreshTokenService.validatePlain(refreshPlain);

        // Invalide/expiré => 401 + clear
        if (!rtOpt.isPresent()) {
            CookieUtils.clearCookie(
                    response, cookieName,
                    appProps.getAuth().getRefreshCookieDomain(),
                    appProps.getAuth().isRefreshCookieSecure(),
                    sameSite()
            );
            return ResponseEntity.status(401).build();
        }

        // Rotation du refresh token
        RefreshToken oldRt = rtOpt.get();
        User user = oldRt.getUser();
        refreshTokenService.revoke(oldRt);
        String newRefreshPlain = refreshTokenService.issue(user);
        int maxAge = appProps.getAuth().getRefreshTtlDays() * 24 * 60 * 60;

        CookieUtils.addHttpOnlyCookie(
                response, cookieName, newRefreshPlain,
                appProps.getAuth().getRefreshCookieDomain(),
                appProps.getAuth().isRefreshCookieSecure(),
                maxAge, sameSite()
        );

        // Génère un nouvel access token
        Map<String, Object> claims = new HashMap<String, Object>();
        claims.put("uid", user.getId());
        claims.put("role", user.getRole().name());
        String newAccessToken = jwtService.generateToken(user.getEmail(), claims);

        return ResponseEntity.ok(new AuthResponse(newAccessToken));
    }

    /* ---------------- LOGOUT ---------------- */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserDetails principal,
                                    HttpServletResponse response) {
        try {
            // Efface toujours le cookie
            CookieUtils.clearCookie(
                    response,
                    appProps.getAuth().getRefreshCookieName(),
                    appProps.getAuth().getRefreshCookieDomain(),
                    appProps.getAuth().isRefreshCookieSecure(),
                    sameSite()
            );

            // Révoque les RTs de l'utilisateur connecté si possible
            if (principal != null && principal.getUsername() != null) {
                try {
                    User u = userService.me(principal.getUsername());
                    if (u != null && u.getId() != null) {
                        refreshTokenService.revokeAllFor(u);
                    }
                } catch (Exception ignored) {}
            }

            return ResponseEntity.noContent().build(); // 204
        } catch (Exception e) {
            return ResponseEntity.noContent().build();
        }
    }

    /* ---------------- Utils ---------------- */
    private String extractCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie c : cookies) {
            if (name.equals(c.getName())) return c.getValue();
        }
        return null;
    }
}
