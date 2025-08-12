package com.minaobackend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Cors cors = new Cors();
    private Auth auth = new Auth();

    public Cors getCors() { return cors; }
    public Auth getAuth() { return auth; }

    // --- sous-objet: app.cors.*
    public static class Cors {
        private List<String> allowedOrigins;

        public List<String> getAllowedOrigins() { return allowedOrigins; }
        public void setAllowedOrigins(List<String> allowedOrigins) { this.allowedOrigins = allowedOrigins; }
    }

    // --- sous-objet: app.auth.*
    public static class Auth {
        private int refreshTtlDays = 7;
        private String refreshCookieName = "rt";
        private String refreshCookieDomain = "";
        private boolean refreshCookieSecure = false;

        public int getRefreshTtlDays() { return refreshTtlDays; }
        public void setRefreshTtlDays(int refreshTtlDays) { this.refreshTtlDays = refreshTtlDays; }

        public String getRefreshCookieName() { return refreshCookieName; }
        public void setRefreshCookieName(String refreshCookieName) { this.refreshCookieName = refreshCookieName; }

        public String getRefreshCookieDomain() { return refreshCookieDomain; }
        public void setRefreshCookieDomain(String refreshCookieDomain) { this.refreshCookieDomain = refreshCookieDomain; }

        public boolean isRefreshCookieSecure() { return refreshCookieSecure; }
        public void setRefreshCookieSecure(boolean refreshCookieSecure) { this.refreshCookieSecure = refreshCookieSecure; }
    }
}
