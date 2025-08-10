package com.minaobackend.controller;

import com.minaobackend.dto.auth.*;
import com.minaobackend.entity.User;
import com.minaobackend.service.interfaces.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest req) {
        User u = userService.register(req.getFullName(), req.getEmail(), req.getPassword());
        u.setPassword(null);
        return ResponseEntity.ok(u);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        String token = userService.login(req.getEmail(), req.getPassword());
        return ResponseEntity.ok(new AuthResponse(token));
    }


    @GetMapping("/me")
    public ResponseEntity<User> me(@AuthenticationPrincipal UserDetails principal) {
        User u = userService.me(principal.getUsername());
        u.setPassword(null);
        return ResponseEntity.ok(u);
    }
}
