package com.minaobackend.repository;

import com.minaobackend.entity.CartItem;
import com.minaobackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    void deleteByUser(User user);
}
