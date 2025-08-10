package com.minaobackend.service.impl;

import com.minaobackend.entity.Role;
import com.minaobackend.entity.User;
import com.minaobackend.exception.BadRequestException;
import com.minaobackend.repository.UserRepository;
import com.minaobackend.security.JwtService;
import com.minaobackend.service.interfaces.UserService; // <-- garde ce package si c'est bien le tien
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

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

    @Override
    public User register(String fullName, String email, String rawPassword) {
        // Normalise l'email (évite les doublons "A@x.com" vs "a@x.com")
        String normalizedEmail = email == null ? null : email.trim().toLowerCase();

        if (normalizedEmail == null || normalizedEmail.isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        if (rawPassword == null || rawPassword.length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters");
        }
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Email already in use");
        }

        User user = User.builder()
                .fullName(fullName)
                .email(normalizedEmail)
                .password(passwordEncoder.encode(rawPassword))
                .role(Role.USER)
                .build();

        return userRepository.save(user);
    }

    @Override
    public String login(String email, String rawPassword) {
        String normalizedEmail = email == null ? null : email.trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        // Claims compatibles Java 8 (pas de Map.of)
        Map<String, Object> claims = new HashMap<String, Object>();
        claims.put("uid", user.getId());
        claims.put("role", user.getRole().name());

        return jwtService.generateToken(user.getEmail(), claims);
    }

    @Override
    public User me(String email) {
        String normalizedEmail = email == null ? null : email.trim().toLowerCase();
        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }
}
