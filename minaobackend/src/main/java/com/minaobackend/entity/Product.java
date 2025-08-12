package com.minaobackend.entity;

import com.minaobackend.entity.ProductCategory;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name="products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false) private String name;
    @Column(length=2000) private String description;
    @Column(nullable=false, precision=10, scale=2) private BigDecimal price;

    private String imageSrc;
    private String imageAlt;

    // On peut garder CSV en DB si tu préfères, mais mieux en tableaux :
    @ElementCollection
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name="product_id"))
    @Column(name="tag")
    private java.util.List<String> tags = new java.util.ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_search_tags", joinColumns = @JoinColumn(name="product_id"))
    @Column(name="search_tag")
    private java.util.List<String> searchTag = new java.util.ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private ProductCategory category;

    @Column(nullable=false)
    private boolean active = true;
}

