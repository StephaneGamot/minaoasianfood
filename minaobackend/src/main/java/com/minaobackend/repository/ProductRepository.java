// src/main/java/com/minaobackend/repository/ProductRepository.java
package com.minaobackend.repository;

import com.minaobackend.entity.Product;
import com.minaobackend.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrue();
    List<Product> findByActiveTrueAndCategory(ProductCategory category);
}
