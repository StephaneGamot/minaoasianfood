package com.minaobackend.service.interfaces;


import com.minaobackend.dto.auth.AuthResponse;

public interface AuthService {
    AuthResponse login(String email, String rawPassword);
    AuthResponse refresh(String refreshTokenFromCookie);
}
