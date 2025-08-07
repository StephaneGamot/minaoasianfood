package com.minaobackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemRequest {
    private Long productId;
    private String productName;
    private String imageUrl;
    private Double price;
    private Integer quantity;
}
