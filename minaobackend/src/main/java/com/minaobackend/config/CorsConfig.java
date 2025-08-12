// src/main/java/com/minaobackend/config/CorsConfig.java
package com.minaobackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig {

    private final AppProperties appProps;
    public CorsConfig(AppProperties appProps) { this.appProps = appProps; }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String[] origins = appProps.getCors().getAllowedOrigins() == null
                        ? new String[] {}
                        : appProps.getCors().getAllowedOrigins().toArray(new String[0]);

                registry.addMapping("/**")
                        .allowedOrigins(origins)
                        .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}

