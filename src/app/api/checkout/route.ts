// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any, // évite le conflit si tu as des types mal déclarés
});


export async function POST(req: Request) {
  const { cart } = await req.json();

  const line_items = cart.map((item: any) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.priceNumber * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'bancontact'],
    mode: 'payment',
    line_items,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paiement/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paiement/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
