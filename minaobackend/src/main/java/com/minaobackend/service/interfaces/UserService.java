package com.minaobackend.service.interfaces;

import com.minaobackend.entity.User;

public interface UserService {
    User register(String fullName, String email, String rawPassword);
    String login(String email, String rawPassword);
    User me(String email);
}
