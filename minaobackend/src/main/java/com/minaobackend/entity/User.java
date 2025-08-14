// src/main/java/com/minaobackend/entity/User.java
package com.minaobackend.entity;

import com.minaobackend.utils.JsonMapConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Identité
    private String firstName;                 // optionnel

    @Column(nullable = false)
    private String lastName;                  // requis

    // --- Auth
    @Column(nullable = false, unique = true)
    private String email;                     // requis

    @Column(nullable = false)
    private String password;                  // requis (jamais exposé)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;                        // requis (USER par défaut)

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;            // requis

    @Column(nullable = false)
    private String address;

    private String address2;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String postalCode;

    @Column(name = "phone_number", length = 32) // laisse nullable par défaut
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private Gender gender;                    // MALE/FEMALE/OTHER ou null

    private String profilePicUrl;

    // --- Préférences
    @Convert(converter = JsonMapConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, Object> preferences;

    // --- Timestamps
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    // ---- Hooks
    @PrePersist
    void onCreate() {
        if (role == null) role = Role.USER;
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }
}

