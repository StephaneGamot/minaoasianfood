package com.minaobackend.service.impl;

import com.minaobackend.dto.user.UpdateProfileRequest;
import com.minaobackend.entity.Role;
import com.minaobackend.entity.User;
import com.minaobackend.exception.BadRequestException;
import com.minaobackend.repository.UserRepository;
import com.minaobackend.security.JwtService;
import com.minaobackend.service.interfaces.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /* -------------------- utils -------------------- */

    private static String trimToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    private static boolean isBlankCompat(String s) {
        return s == null || s.trim().isEmpty();
    }

    private static String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    /* -------------------- API -------------------- */

    @Override
    @Transactional
    public User register(String lastName, String email, String rawPassword) {
        String ln = trimToNull(lastName);
        String em = normalizeEmail(email);
        String pw = rawPassword; // peut être vide/null → on vérifie

        if (isBlankCompat(ln)) {
            throw new BadRequestException("Last name is required");
        }
        if (isBlankCompat(em)) {
            throw new BadRequestException("Email is required");
        }
        if (pw == null || pw.length() < 6) {
            throw new BadRequestException("Password must be >= 6 characters");
        }

        Optional<User> exists = userRepository.findByEmail(em);
        if (exists.isPresent()) {
            throw new BadRequestException("Email already registered");
        }

        User u = new User();
        u.setLastName(ln);
        u.setEmail(em);
        u.setPassword(passwordEncoder.encode(pw));
        u.setRole(Role.USER);      // défaut
        u.setActive(true);         // défaut

        // Champs d'adresse potentiellement non-nuls selon ton schéma :
        // si ta table les a en NOT NULL, on met des chaînes vides
        if (u.getAddress() == null)   u.setAddress("");
        if (u.getCity() == null)      u.setCity("");
        if (u.getPostalCode() == null) u.setPostalCode("");

        return userRepository.save(u);
    }

    @Override
    @Transactional(readOnly = true)
    public User me(String email) {
        String em = normalizeEmail(email);
        if (isBlankCompat(em)) {
            throw new BadRequestException("Email is required");
        }
        return userRepository.findByEmail(em)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    @Override
    @Transactional
    public User updateMe(String email, UpdateProfileRequest req) {
        String em = normalizeEmail(email);
        if (isBlankCompat(em)) {
            throw new BadRequestException("Email is required");
        }
        User u = userRepository.findByEmail(em)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (req != null) {
            // lastName : requis s’il est fourni
            if (req.getLastName() != null) {
                String ln = trimToNull(req.getLastName());
                if (ln == null) {
                    throw new BadRequestException("Last name cannot be blank");
                }
                u.setLastName(ln);
            }

            // firstName : optionnel
            if (req.getFirstName() != null) {
                u.setFirstName(trimToNull(req.getFirstName()));
            }

            // téléphone
            if (req.getPhoneNumber() != null) {
                u.setPhoneNumber(trimToNull(req.getPhoneNumber()));
            }

            // genre (enum) : on applique si non-null
            if (req.getGender() != null) {
                u.setGender(req.getGender());
            }

            // adresse
            if (req.getAddress() != null) {
                u.setAddress(trimToNull(req.getAddress()));
            }
            if (req.getAddress2() != null) {
                u.setAddress2(trimToNull(req.getAddress2()));
            }
            if (req.getCity() != null) {
                u.setCity(trimToNull(req.getCity()));
            }
            if (req.getPostalCode() != null) {
                u.setPostalCode(trimToNull(req.getPostalCode()));
            }

            // avatar
            if (req.getProfilePicUrl() != null) {
                u.setProfilePicUrl(trimToNull(req.getProfilePicUrl()));
            }
        }

        // @PreUpdate sur l’entité mettra updatedAt à maintenant
        return userRepository.save(u);
    }

    @Override
    public User updateProfilePic(String email, String url) {
        String normalized = email == null ? null : email.trim().toLowerCase();
        User u = userRepository.findByEmail(normalized)
                .orElseThrow(() -> new BadRequestException("User not found"));
        u.setProfilePicUrl(url);
        return userRepository.save(u);
    }

    @Override
    @Transactional(readOnly = true)
    public String login(String email, String rawPassword) {
        String em = normalizeEmail(email);
        if (isBlankCompat(em) || rawPassword == null) {
            throw new BadRequestException("Invalid credentials");
        }

        User u = userRepository.findByEmail(em)
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!u.isActive()) {
            throw new BadRequestException("User is deactivated");
        }
        if (!passwordEncoder.matches(rawPassword, u.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        Map<String, Object> claims = new HashMap<String, Object>();
        claims.put("uid", u.getId());
        claims.put("role", u.getRole().name());

        // Le JwtService expose déjà generateToken(subject, claims)
        return jwtService.generateToken(u.getEmail(), claims);
    }
}
