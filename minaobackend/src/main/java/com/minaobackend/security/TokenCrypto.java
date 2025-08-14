package com.minaobackend.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

public final class TokenCrypto {
    private TokenCrypto() {}

    private static final SecureRandom RNG = new SecureRandom();

    /** Génère un token aléatoire (URL-safe, sans padding) à partir de N octets. */
    public static String generateRandomBase64Url(int numBytes) {
        byte[] buf = new byte[numBytes];
        RNG.nextBytes(buf);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
    }

    /** SHA-256 puis encodage Base64 URL-safe (sans padding). */
    public static String sha256Base64Url(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(
                    input == null ? new byte[0] : input.getBytes(StandardCharsets.UTF_8)
            );
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 error", e);
        }
    }
}

