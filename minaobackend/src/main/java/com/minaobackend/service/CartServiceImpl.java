package com.minaobackend.service;

import com.minaobackend.entity.CartItem;
import com.minaobackend.repository.CartItemRepository;
import com.minaobackend.service.CartService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;

    public CartServiceImpl(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    public List<CartItem> getCartItemsByUserId(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    @Override
    public CartItem saveCartItem(CartItem item) {
        return cartItemRepository.save(item);
    }

    @Override
    public void clearCartByUserId(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
