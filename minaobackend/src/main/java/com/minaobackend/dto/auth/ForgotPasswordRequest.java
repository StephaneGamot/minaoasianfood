// src/main/java/com/minaobackend/dto/auth/ForgotPasswordRequest.java
package com.minaobackend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class ForgotPasswordRequest {
    @Email @NotBlank private String email;
}

