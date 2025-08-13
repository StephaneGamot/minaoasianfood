package com.minaobackend.service.impl;

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

@Service
@Transactional
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

    @Override
    public User register(String lastName, String email, String rawPassword) {
        String normalizedEmail = email == null ? null : email.trim().toLowerCase();

        if (normalizedEmail == null || normalizedEmail.isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        if (rawPassword == null || rawPassword.length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters");
        }
        if (lastName == null || lastName.trim().isEmpty()) {
            throw new BadRequestException("Last name is required");
        }
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Email already in use");
        }

        User user = User.builder()
                .firstName(null)                        // /me plus tard
                .lastName(lastName.trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(rawPassword))
                .phoneNumber(null)                      // /me plus tard

                // ⚠️ Ces 3 colonnes sont NOT NULL en DB → on met des valeurs vides pour l’instant
                .address("")
                .city("")
                .postalCode("")

                .role(Role.USER)
                .active(true)
                .build();

        return userRepository.save(user);
    }


    @Override
    public String login(String email, String rawPassword) {
        String normalizedEmail = email == null ? null : email.trim().toLowerCase();
        if (normalizedEmail == null || normalizedEmail.isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        // Claims optionnels
        Map<String, Object> claims = new HashMap<>();
        claims.put("uid", user.getId());
        claims.put("role", user.getRole().name());

        return jwtService.generateToken(user.getEmail(), claims);
    }

    @Override
    @Transactional(readOnly = true)
    public User me(String email) {
        String normalizedEmail = email == null ? null : email.trim().toLowerCase();
        if (normalizedEmail == null || normalizedEmail.isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }
}

