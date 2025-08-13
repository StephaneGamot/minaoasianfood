// src/main/java/com/minaobackend/config/CorsConfig.java
package com.minaobackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
public class CorsConfig {

    private final AppProperties appProps;

    public CorsConfig(AppProperties appProps) {
        this.appProps = appProps;
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                // Fallback dev si non configuré dans appProps
                List<String> allowed = (appProps != null
                        && appProps.getCors() != null
                        && appProps.getCors().getAllowedOrigins() != null
                        && !appProps.getCors().getAllowedOrigins().isEmpty())
                        ? appProps.getCors().getAllowedOrigins()
                        : Collections.singletonList("http://localhost:3000");

                registry.addMapping("/**")
                        .allowedOrigins(allowed.toArray(new String[0]))
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin")
                        .exposedHeaders("Authorization")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
