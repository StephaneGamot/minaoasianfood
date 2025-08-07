package com.minaobackend.controller;

import com.minaobackend.entity.User;
import com.minaobackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return userService.getUserByEmail(userDetails.getUsername()).orElse(null);
    }
}
