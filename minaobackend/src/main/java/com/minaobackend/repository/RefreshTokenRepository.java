// src/main/java/com/minaobackend/repository/RefreshTokenRepository.java
package com.minaobackend.repository;

import com.minaobackend.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // <-- IMPORTANT

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update RefreshToken rt " +
            "   set rt.revoked = true " +
            " where rt.user.id = :userId " +
            "   and rt.revoked = false")
    void revokeAllActiveByUserId(@Param("userId") Long userId);
}
