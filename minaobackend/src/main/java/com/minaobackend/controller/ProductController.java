// src/main/java/com/minaobackend/controller/ProductPublicController.java
package com.minaobackend.controller;

import com.minaobackend.dto.product.ProductFrontDto;
import com.minaobackend.entity.Product;
import com.minaobackend.entity.ProductCategory;
import com.minaobackend.repository.ProductRepository;
import com.minaobackend.service.impl.ProductFrontMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@Tag(name = "Products (public)")
@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductRepository repo;
    public ProductController(ProductRepository repo){ this.repo = repo; }

    @GetMapping
    public ResponseEntity<List<ProductFrontDto>> list(
            @RequestParam(required = false) ProductCategory category,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String tag
    ){
        List<Product> data = (category == null)
                ? repo.findByActiveTrue()
                : repo.findByActiveTrueAndCategory(category);

        // --- filtres mémoire (compat Java 8, pas de isBlank) ---
        if (!isNullOrBlank(q)) {
            final String qq = q.toLowerCase();
            data = data.stream().filter(p ->
                    (p.getName() != null && p.getName().toLowerCase().contains(qq)) ||
                            (p.getSearchTag() != null && p.getSearchTag().stream()
                                    .anyMatch(t -> t != null && t.toLowerCase().contains(qq)))
            ).collect(Collectors.toList());
        }

        if (!isNullOrBlank(tag)) {
            final String tt = tag.toLowerCase();
            data = data.stream().filter(p ->
                    p.getTags() != null && p.getTags().stream()
                            .anyMatch(t -> t != null && t.equalsIgnoreCase(tt))
            ).collect(Collectors.toList());
        }

        // Tri par nom (case-insensitive), nulls en dernier (compat Java 8)
        Collections.sort(data, new Comparator<Product>() {
            @Override public int compare(Product a, Product b) {
                String na = a == null ? null : a.getName();
                String nb = b == null ? null : b.getName();
                if (na == null && nb == null) return 0;
                if (na == null) return 1; // nulls last
                if (nb == null) return -1;
                return String.CASE_INSENSITIVE_ORDER.compare(na, nb);
            }
        });

        List<ProductFrontDto> out = data.stream()
                .map(ProductFrontMapper::toFront)
                .collect(Collectors.toList());

        return ResponseEntity.ok(out);
    }

    @GetMapping("/section/{slug}")
    public ResponseEntity<List<ProductFrontDto>> bySectionSlug(@PathVariable String slug){
        ProductCategory cat = null;
        for (ProductCategory c : ProductCategory.values()) {
            if (c.slug.equalsIgnoreCase(slug)) { cat = c; break; }
        }
        if (cat == null) return ResponseEntity.notFound().build();

        List<Product> list = repo.findByActiveTrueAndCategory(cat);
        Collections.sort(list, new Comparator<Product>() {
            @Override public int compare(Product a, Product b) {
                String na = a == null ? null : a.getName();
                String nb = b == null ? null : b.getName();
                if (na == null && nb == null) return 0;
                if (na == null) return 1;
                if (nb == null) return -1;
                return String.CASE_INSENSITIVE_ORDER.compare(na, nb);
            }
        });

        List<ProductFrontDto> out = list.stream()
                .map(ProductFrontMapper::toFront)
                .collect(Collectors.toList());

        return ResponseEntity.ok(out);
    }

    // --- helpers compat Java 8 ---
    private static boolean isNullOrBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
