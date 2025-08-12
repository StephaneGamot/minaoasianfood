// src/main/java/com/minaobackend/dto/auth/RefreshRequest.java
package com.minaobackend.dto.auth;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class RefreshRequest {
    @NotBlank private String refreshToken;
}
