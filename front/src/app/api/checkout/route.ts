import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs"; // Stripe SDK => Node runtime

// ⬇️ Lazy init pour éviter l'erreur au build
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2025-07-30.basil" as Stripe.LatestApiVersion });
}

type Locale = "fr" | "en" | "nl";
type Mode = "delivery" | "pickup";

interface Payload {
  locale: Locale;
  mode: Mode;
  items: { id: string | number; name: string; priceNumber: number; quantity: number; imageSrc?: string }[];
  shipping?: { firstName?: string; lastName?: string; address?: string; postalCode?: string; city?: string; phone?: string; email?: string };
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe(); // ⬅️ ici, pas au top-level
    const body = (await req.json()) as Payload;
    const { locale, mode, items, shipping } = body;

    if (!items?.length) return NextResponse.json({ error: "Panier vide" }, { status: 400 });

    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(i.priceNumber * 100),
        product_data: {
          name: i.name,
          images: i.imageSrc ? [`${base}${i.imageSrc.startsWith("/") ? i.imageSrc : `/${i.imageSrc}`}`] : undefined,
          metadata: { id: String(i.id) },
        },
      },
    }));

    if (mode === "delivery") {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: 490,
          product_data: { name: "Frais de livraison" },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${base}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/${locale}/checkout`,
      locale,
      line_items,
      allow_promotion_codes: true,
      shipping_address_collection: { allowed_countries: ["BE", "FR", "NL"] },
      metadata: {
        mode,
        firstName: shipping?.firstName ?? "",
        lastName: shipping?.lastName ?? "",
        address: shipping?.address ?? "",
        postalCode: shipping?.postalCode ?? "",
        city: shipping?.city ?? "",
        phone: shipping?.phone ?? "",
        email: shipping?.email ?? "",
      },
    });

    if (!session.url) return NextResponse.json({ error: "Stripe n’a pas retourné d’URL" }, { status: 500 });
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: unknown) { 
    const message = e instanceof Error ? e.message : "Checkout error";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
