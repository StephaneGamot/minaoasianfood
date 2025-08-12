// src/main/java/com/minaobackend/dto/product/ProductFrontDto.java
package com.minaobackend.dto.product;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductFrontDto {
    private Long id;
    private String name;
    private String description;
    private String href;
    private String imageSrc;
    private String imageAlt;
    private String price;          // "13,90 €"
    private BigDecimal priceNumber;
    private List<String> tags;
    private List<String> searchTag;
}
