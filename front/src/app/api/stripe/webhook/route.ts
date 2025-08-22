import { NextResponse } from "next/server";
import Stripe from "stripe";
import { updatePaymentStatus, getOrder } from "@/lib/orderStore";
import { notifyRestaurantPaymentUpdate } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";



export async function POST(req: Request) {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "no signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook verify failed", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = (pi.metadata?.orderId as string) || "";
      if (orderId) {
        await updatePaymentStatus(orderId, "paid");
        await notifyRestaurantPaymentUpdate(orderId, "payé");
      }
    }

    if (event.type === "checkout.session.completed") {
      const s = event.data.object as Stripe.Checkout.Session;
      const orderId = (s.metadata?.orderId as string) || (s.client_reference_id as string) || "";
      if (orderId) {
        await updatePaymentStatus(orderId, "paid");
        await notifyRestaurantPaymentUpdate(orderId, "payé");
      }
    }

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
