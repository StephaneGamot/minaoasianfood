package com.minaobackend.security;

import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;

public final class CookieUtils {
    private CookieUtils() {}

    public static void addHttpOnlyCookie(HttpServletResponse res,
                                         String name,
                                         String value,
                                         String domain,   // passer "" ou null en dev
                                         boolean secure,  // false en dev (http)
                                         int maxAgeSeconds,
                                         String sameSite) { // "Lax" en dev, "None" si Secure=true
        StringBuilder sb = new StringBuilder();
        sb.append(name).append("=").append(value)
                .append("; Path=/")
                .append("; Max-Age=").append(maxAgeSeconds)
                .append("; HttpOnly")
                .append("; SameSite=").append(sameSite);
        if (secure) sb.append("; Secure");

        // NE PAS mettre Domain=localhost (Chrome l’ignore / cause des soucis)
        if (StringUtils.isNotBlank(domain) && !"localhost".equalsIgnoreCase(domain)) {
            sb.append("; Domain=").append(domain);
        }
        res.addHeader("Set-Cookie", sb.toString());
    }

    public static void clearCookie(HttpServletResponse res,
                                   String name,
                                   String domain,
                                   boolean secure,
                                   String sameSite) {
        StringBuilder sb = new StringBuilder();
        sb.append(name).append("=deleted")
                .append("; Path=/")
                .append("; Max-Age=0")
                .append("; HttpOnly")
                .append("; SameSite=").append(sameSite);
        if (secure) sb.append("; Secure");
        if (StringUtils.isNotBlank(domain) && !"localhost".equalsIgnoreCase(domain)) {
            sb.append("; Domain=").append(domain);
        }
        res.addHeader("Set-Cookie", sb.toString());
    }
}
