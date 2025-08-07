package com.minaobackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Hashed

    @Column(nullable = false)
    private String role; // Ex: "USER", "ADMIN"

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<CartItem> cartItems;
}
