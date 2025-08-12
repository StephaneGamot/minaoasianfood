// src/main/java/com/minaobackend/controller/AdminUserController.java
package com.minaobackend.controller;

import com.minaobackend.entity.User;
import com.minaobackend.exception.NotFoundException;
import com.minaobackend.repository.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Admin - Users")
@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PatchMapping("/{id}/disable")
    public ResponseEntity<?> disable(@PathVariable Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        if (!u.isActive()) return ResponseEntity.noContent().build();
        u.setActive(false);
        userRepository.save(u);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/enable")
    public ResponseEntity<?> enable(@PathVariable Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        if (u.isActive()) return ResponseEntity.noContent().build();
        u.setActive(true);
        userRepository.save(u);
        return ResponseEntity.noContent().build();
    }
}
