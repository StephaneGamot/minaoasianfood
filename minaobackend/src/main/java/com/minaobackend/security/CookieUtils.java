package com.minaobackend.security;

import jakarta.servlet.http.HttpServletResponse;

public final class CookieUtils {
    private CookieUtils() {}

    public static void addHttpOnlyCookie(HttpServletResponse response,
                                         String name,
                                         String value,
                                         String domain,
                                         boolean secure,
                                         int maxAgeSeconds,
                                         String sameSite) {
        StringBuilder sb = new StringBuilder();
        sb.append(name).append("=").append(value).append(";");
        sb.append(" Path=/;");
        if (domain != null && !domain.isEmpty()) {
            sb.append(" Domain=").append(domain).append(";");
        }
        sb.append(" HttpOnly;");
        if (secure) sb.append(" Secure;");
        if (maxAgeSeconds >= 0) sb.append(" Max-Age=").append(maxAgeSeconds).append(";");
        if (sameSite != null) sb.append(" SameSite=").append(sameSite).append(";");
        response.addHeader("Set-Cookie", sb.toString());
    }

    public static void clearCookie(HttpServletResponse response,
                                   String name,
                                   String domain,
                                   boolean secure,
                                   String sameSite) {
        addHttpOnlyCookie(response, name, "", domain, secure, 0, sameSite);
    }
}
