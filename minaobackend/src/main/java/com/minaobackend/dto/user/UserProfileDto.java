// src/main/java/com/minaobackend/dto/user/UserProfileDto.java
package com.minaobackend.dto.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.minaobackend.entity.Role;
import com.minaobackend.entity.Gender;

import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL) // n’exporte pas les null
public class UserProfileDto {
    public Long id;
    public String firstName;         // ❌ obligatoire
    public String lastName;          // ✅
    public String email;             // ✅

    public String address;           // ❌
    public String address2;          // ❌
    public String city;              // ❌
    public String postalCode;        // ❌
    public String phoneNumber;       // ❌

    public Gender gender;            // ❌ (MALE/FEMALE/OTHER)
    public String profilePicUrl;     // ❌

    public Role role;                // ✅
    public boolean active;           // ✅

    public Instant createdAt;        // ✅
    public Instant updatedAt;        // ✅

    public Map<String, Object> preferences; // ❌
}
