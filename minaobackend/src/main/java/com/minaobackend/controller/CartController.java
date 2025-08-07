package com.minaobackend.controller;

import com.minaobackend.dto.CartItemRequest;
import com.minaobackend.entity.CartItem;
import com.minaobackend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public List<CartItem> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        // TODO: récupérer le userId via UserDetails
        return cartService.getCartItemsByUserId(1L); // temporaire
    }

    @PostMapping
    public CartItem addItem(@RequestBody CartItemRequest request) {
        CartItem item = new CartItem();
        item.setProductName(request.getProductName());
        item.setPrice(request.getPrice());
        item.setQuantity(request.getQuantity());
        // item.setUser(user); // si User est nécessaire
        return cartService.saveCartItem(item);
    }

    @DeleteMapping("/clear")
    public void clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCartByUserId(1L); // temporaire
    }
}
