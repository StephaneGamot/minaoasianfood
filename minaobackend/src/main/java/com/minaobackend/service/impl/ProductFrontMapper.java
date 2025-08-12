// src/main/java/com/minaobackend/service/impl/ProductFrontMapper.java
package com.minaobackend.service.impl;

import com.minaobackend.dto.product.ProductFrontDto;
import com.minaobackend.entity.Product;

import java.text.NumberFormat;
import java.util.*;
import java.util.stream.Collectors;

public final class ProductFrontMapper {
    // Locale FR-BE pour format "13,90 €"
    private static final Locale LOCALE_FR_BE = Locale.forLanguageTag("fr-BE");

    private ProductFrontMapper(){}

    public static ProductFrontDto toFront(Product p){
        ProductFrontDto d = new ProductFrontDto();
        d.setId(p.getId());
        d.setName(p.getName());
        d.setDescription(p.getDescription());
        d.setImageSrc(p.getImageSrc());
        d.setImageAlt(p.getImageAlt());
        d.setHref(p.getCategory() != null ? p.getCategory().href : "/menu");

        d.setPriceNumber(p.getPrice());

        NumberFormat nf = NumberFormat.getCurrencyInstance(LOCALE_FR_BE);
        nf.setCurrency(Currency.getInstance("EUR"));
        d.setPrice(nf.format(p.getPrice())); // => "13,90 €"

        // Si @ElementCollection (List<String>) en DB :
        d.setTags(p.getTags() == null ? Collections.emptyList() : p.getTags());
        d.setSearchTag(p.getSearchTag() == null ? Collections.emptyList() : p.getSearchTag());

        // Si tu utilises des colonnes CSV côté DB, remplace par :
        // d.setTags(csvToList(p.getTagsCsv()));
        // d.setSearchTag(csvToList(p.getSearchTagCsv()));

        return d;
    }

    private static List<String> csvToList(String csv){
        if (csv == null || csv.trim().isEmpty()) return Collections.emptyList();
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}
