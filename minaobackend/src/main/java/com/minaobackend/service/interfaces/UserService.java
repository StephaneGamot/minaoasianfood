package com.minaobackend.service.interfaces;

import com.minaobackend.entity.User;
import com.minaobackend.dto.user.UpdateProfileRequest;

public interface UserService {
    User register(String lastName, String email, String rawPassword);
    String login(String email, String rawPassword);
    User me(String email);
    User updateMe(String email, UpdateProfileRequest req);
    User updateProfilePic(String email, String url);
}
