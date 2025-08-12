package com.minaobackend.controller;

import com.minaobackend.entity.User;
import com.minaobackend.exception.BadRequestException;
import com.minaobackend.repository.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Tag(name="Users")
@RestController
@RequestMapping("/me")
public class UserController {

    private final UserRepository userRepository;
    public UserController(UserRepository userRepository) { this.userRepository = userRepository; }

    @PatchMapping("/deactivate")
    public ResponseEntity<?> deactivate(@AuthenticationPrincipal UserDetails principal){
        User u = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found"));

        u.setActive(false);
        userRepository.save(u);
        return ResponseEntity.noContent().build();
    }
}
