package com.minaobackend.service;

import com.minaobackend.dto.PaymentRequest;
import com.minaobackend.service.PaymentService;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Override
    public String createCheckoutSession(PaymentRequest request) throws Exception {
        Stripe.apiKey = stripeSecretKey;

        List<SessionCreateParams.LineItem> lineItems = request.getItems().stream().map(item ->
                SessionCreateParams.LineItem.builder()
                        .setQuantity((long) item.getQuantity())
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("eur")
                                        .setUnitAmount((long) (item.getPriceNumber() * 100))
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName(item.getName())
                                                        .build()
                                        )
                                        .build()
                        )
                        .build()
        ).toList();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("https://ton-site.com/success")
                .setCancelUrl("https://ton-site.com/cancel")
                .addAllLineItem(lineItems)
                .build();

        Session session = Session.create(params);
        return session.getUrl();
    }
}
