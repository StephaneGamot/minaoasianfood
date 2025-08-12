// src/main/java/com/minaobackend/dto/auth/ChangePasswordRequest.java
package com.minaobackend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class ChangePasswordRequest {
    @NotBlank private String currentPassword;
    @NotBlank private String newPassword; // >= 6 char côté service
}
