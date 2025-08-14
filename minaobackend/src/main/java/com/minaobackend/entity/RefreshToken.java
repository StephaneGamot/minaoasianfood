// src/main/java/com/minaobackend/entity/RefreshToken.java
package com.minaobackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "refresh_token")
@Getter @Setter
@NoArgsConstructor
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // relation vers User
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ⚠️ On mappe tokenHash sur la colonne existante 'token'
    @Column(name = "token", nullable = false, unique = true, length = 64)
    private String tokenHash;

    @Column(name = "revoked", nullable = false)
    private boolean revoked = false;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    // petite fabrique pratique
    public static RefreshToken of(User user, String tokenHash, Instant expiresAt) {
        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setTokenHash(tokenHash);
        rt.setRevoked(false);
        rt.setExpiresAt(expiresAt);
        return rt;
    }
}


