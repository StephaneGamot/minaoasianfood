package com.minaobackend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI api() {
        final String securitySchemeName = "bearer-jwt";
        return new OpenAPI()
                .info(new Info()
                        .title("API Restaurant Minao")
                        .description("Spring Boot 3.5.x • Java 21 • JWT • Swagger")
                        .version("1.0.0"))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                // Sécurité par défaut pour toutes les routes (tu peux aussi le mettre seulement sur certaines)
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName));
    }
}
