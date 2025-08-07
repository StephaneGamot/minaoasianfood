package com.minaobackend.service;

import com.minaobackend.entity.User;

import java.util.Optional;

public interface UserService {
    Optional<User> getUserByEmail(String email);
    User saveUser(User user);
}
