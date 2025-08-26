// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { updatePaymentStatus, getOrder } from "@/lib/orderStore";
import { notifyRestaurantNewOrder, notifyRestaurantPaymentUpdate } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // --- Vérif configuration
  const secret = (process.env.STRIPE_SECRET_KEY || "").trim();
  const whSecret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();

  if (!secret || !whSecret) {
    console.error("[webhook] Missing env:", {
      STRIPE_SECRET_KEY: !!secret,
      STRIPE_WEBHOOK_SECRET: !!whSecret,
    });
    return NextResponse.json({ error: "misconfigured" }, { status: 500 });
  }

  const stripe = new Stripe(secret);

  // --- Signature
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "no signature" }, { status: 400 });

  // ⚠️ Important: on lit le corps brut (pas de req.json())
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (err) {
    console.error("[webhook] verify failed:", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  // --- Traitement des événements
  try {
    switch (event.type) {
      // 1) PaymentIntent confirmé (Stripe Elements)
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = (pi.metadata?.orderId as string) || "";
        if (orderId) {
          await updatePaymentStatus(orderId, "paid");

          // On récupère la commande pour pouvoir router l'email correctement
          const order = await getOrder(orderId);

          // Pour les paiements par carte: on envoie l'email COMPLET une fois payé
          if (order?.paymentMethod === "stripe") {
            try {
              await notifyRestaurantNewOrder({ ...order, paymentStatus: "paid" });
            } catch (e) {
              console.warn("[webhook] notifyRestaurantNewOrder failed:", e);
            }
          } else {
            // Cas théorique (si la méthode n'était pas 'stripe')
            try {
              await notifyRestaurantPaymentUpdate(orderId, "payé");
            } catch (e) {
              console.warn("[webhook] notifyRestaurantPaymentUpdate failed:", e);
            }
          }
        }
        break;
      }

      // 2) Checkout Session confirmée (Stripe Checkout)
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const orderId =
          (s.metadata?.orderId as string) ||
          (s.client_reference_id as string) ||
          "";

        if (orderId) {
          await updatePaymentStatus(orderId, "paid");

          const order = await getOrder(orderId);
          if (order?.paymentMethod === "stripe") {
            try {
              await notifyRestaurantNewOrder({ ...order, paymentStatus: "paid" });
            } catch (e) {
              console.warn("[webhook] notifyRestaurantNewOrder failed:", e);
            }
          } else {
            try {
              await notifyRestaurantPaymentUpdate(orderId, "payé");
            } catch (e) {
              console.warn("[webhook] notifyRestaurantPaymentUpdate failed:", e);
            }
          }
        }
        break;
      }

      // 3) Échec de paiement
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = (pi.metadata?.orderId as string) || "";
        if (orderId) {
          await updatePaymentStatus(orderId, "canceled");
          try {
            await notifyRestaurantPaymentUpdate(orderId, "refusé");
          } catch (e) {
            console.warn("[webhook] notifyRestaurantPaymentUpdate failed:", e);
          }
        }
        break;
      }

      // Autres événements : on acquitte simplement
      default: {
        // Optionnel: log léger pour debug
        // console.log("[webhook] Unhandled event:", event.type);
        break;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e) {
    // Ne pas renvoyer 5xx à Stripe à cause d’un e-mail qui plante :
    console.error("[webhook] handler error:", e);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
