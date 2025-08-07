package com.minaobackend.service;

import com.minaobackend.dto.PaymentRequest;

public interface PaymentService {
    String createCheckoutSession(PaymentRequest request) throws Exception;
}
