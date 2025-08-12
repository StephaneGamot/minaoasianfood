// src/main/java/com/minaobackend/dto/auth/ResetPasswordRequest.java
package com.minaobackend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class ResetPasswordRequest {
    @NotBlank private String token;
    @NotBlank private String newPassword;
}
