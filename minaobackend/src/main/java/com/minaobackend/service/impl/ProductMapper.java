// src/main/java/com/minaobackend/service/impl/ProductMapper.java
package com.minaobackend.service.impl;

import com.minaobackend.dto.product.*;
import com.minaobackend.entity.Product;

import java.util.*;
import java.util.stream.Collectors;

public final class ProductMapper {
    private ProductMapper(){}

    // ===== Helpers CSV <-> List =====
    private static List<String> csvToList(String csv){
        if (csv == null || csv.trim().isEmpty()) return Collections.emptyList();
        String[] parts = csv.split(",");
        List<String> out = new ArrayList<String>(parts.length);
        for (String part : parts) {
            if (part != null) {
                String v = part.trim();
                if (!v.isEmpty()) out.add(v);
            }
        }
        return out;
    }

    private static String listToCsv(List<String> list){
        if (list == null || list.isEmpty()) return "";
        return list.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.joining(","));
    }

    // ===== Create =====
    public static Product toEntity(ProductCreateRequest dto){
        return Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .imageSrc(dto.getImageSrc())
                .imageAlt(dto.getImageAlt())
                .tags(csvToList(dto.getTags()))            // CSV -> List<String>
                .searchTag(csvToList(dto.getSearchTag()))  // CSV -> List<String>
                .active(dto.getActive() == null || dto.getActive().booleanValue())
                .build();
    }

    // ===== Update in-place =====
    public static void copy(ProductUpdateRequest dto, Product p){
        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        p.setPrice(dto.getPrice());
        p.setImageSrc(dto.getImageSrc());
        p.setImageAlt(dto.getImageAlt());
        p.setTags(csvToList(dto.getTags()));              // CSV -> List<String>
        p.setSearchTag(csvToList(dto.getSearchTag()));    // CSV -> List<String>
        p.setActive(dto.getActive() != null && dto.getActive().booleanValue());
    }

    // ===== Response (List -> CSV) =====
    public static ProductResponse toResponse(Product p){
        ProductResponse r = new ProductResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setDescription(p.getDescription());
        r.setPrice(p.getPrice());
        r.setImageSrc(p.getImageSrc());
        r.setImageAlt(p.getImageAlt());
        r.setTags(listToCsv(p.getTags()));                // List<String> -> CSV
        r.setSearchTag(listToCsv(p.getSearchTag()));      // List<String> -> CSV
        r.setActive(p.isActive());
        return r;
    }
}
