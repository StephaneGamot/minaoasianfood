package com.minaobackend.service;

import com.minaobackend.dto.AuthRequest;
import com.minaobackend.dto.AuthResponse;
import com.minaobackend.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
}
