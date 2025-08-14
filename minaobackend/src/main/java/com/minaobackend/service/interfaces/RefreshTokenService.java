// src/main/java/com/minaobackend/service/interfaces/RefreshTokenService.java
package com.minaobackend.service.interfaces;

import com.minaobackend.entity.RefreshToken;
import com.minaobackend.entity.User;

import java.util.Optional;

public interface RefreshTokenService {
    /** Émet un nouveau refresh token (retourne la valeur "raw" à mettre en cookie). */
    String issue(User user);

    /** Valide un refresh "raw" (hash + non révoqué + non expiré). */
    Optional<RefreshToken> validatePlain(String raw);

    /** Marque un token comme révoqué (idempotent). */
    void revoke(RefreshToken token);

    /** Révoque tous les tokens actifs pour cet utilisateur. */
    void revokeAllFor(User user);

    /** Variante pratique si tu n’as que l’ID sous la main. */
    void revokeAllForUser(Long userId);
}
