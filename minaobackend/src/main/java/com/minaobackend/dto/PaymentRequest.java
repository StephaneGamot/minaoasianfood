package com.minaobackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {
    private Double amount;
    private String currency;
    private String paymentMethodId; // Stripe token/id
}
