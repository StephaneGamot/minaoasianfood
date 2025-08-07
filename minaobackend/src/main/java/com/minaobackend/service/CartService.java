package com.minaobackend.service;

import com.minaobackend.entity.CartItem;

import java.util.List;

public interface CartService {
    List<CartItem> getCartItemsByUserId(Long userId);
    CartItem saveCartItem(CartItem item);
    void clearCartByUserId(Long userId);
}
