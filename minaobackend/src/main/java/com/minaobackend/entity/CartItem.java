package com.minaobackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;

    private String productName;

    private String imageUrl;

    private Double price;

    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
