import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

type CartItem = {
  name: string;
  priceNumber: number;
  quantity: number;
};

export async function POST(req: Request) {
  const { cart }: { cart: CartItem[] } = await req.json();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.map((item) => ({
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

