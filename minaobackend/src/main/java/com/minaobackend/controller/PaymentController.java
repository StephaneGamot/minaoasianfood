package com.minaobackend.controller;

import com.minaobackend.dto.PaymentRequest;
import com.minaobackend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/checkout")
    public ResponseEntity<String> createCheckoutSession(@RequestBody PaymentRequest request) {
        try {
            String sessionUrl = paymentService.createCheckoutSession(request);
            return ResponseEntity.ok(sessionUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur de paiement: " + e.getMessage());
        }
    }
}
