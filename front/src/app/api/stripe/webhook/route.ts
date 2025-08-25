// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { updatePaymentStatus, getOrder } from "@/lib/orderStore";
import { notifyRestaurantNewOrder, notifyRestaurantPaymentUpdate } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = (process.env.STRIPE_SECRET_KEY || "").trim();
  if (!secret) {
    console.error("[webhook] STRIPE_SECRET_KEY missing");
    return NextResponse.json({ error: "misconfigured" }, { status: 500 });
  }

  const stripe = new Stripe(secret);

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "no signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;

  try {
    const whSecret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (err) {
    console.error("Webhook verify failed", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    // 1) PaymentIntent confirmé (Elements)
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = (pi.metadata?.orderId as string) || "";
      if (orderId) {
        await updatePaymentStatus(orderId, "paid");
        const order = await getOrder(orderId);
        if (order?.paymentMethod === "stripe") {
          // Envoie l'email COMPLET maintenant que c'est payé
          await notifyRestaurantNewOrder({ ...order, paymentStatus: "paid" });
        } else {
          // fallback info
          await notifyRestaurantPaymentUpdate(orderId, "payé");
        }
      }
    }

    // 2) Checkout Session confirmé (Checkout)
    if (event.type === "checkout.session.completed") {
      const s = event.data.object as Stripe.Checkout.Session;
      const orderId =
        (s.metadata?.orderId as string) ||
        (s.client_reference_id as string) ||
        "";
      if (orderId) {
        await updatePaymentStatus(orderId, "paid");
        const order = await getOrder(orderId);
        if (order?.paymentMethod === "stripe") {
          await notifyRestaurantNewOrder({ ...order, paymentStatus: "paid" });
        } else {
          await notifyRestaurantPaymentUpdate(orderId, "payé");
        }
      }
    }

    // 3) Échec de paiement
    if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = (pi.metadata?.orderId as string) || "";
      if (orderId) {
        await updatePaymentStatus(orderId, "canceled");
        await notifyRestaurantPaymentUpdate(orderId, "refusé");
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e) {
    console.error("Webhook handler error", e);
    return NextResponse.json({ error: "handler error" }, { status: 500 });
  }
}
