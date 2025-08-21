import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_CATALOG: Record<string, { name: string; unitAmount: number }> = {
  "1": { name: "Ritchie Cola Natural", unitAmount: 290 },
  "2": { name: "Ritchie Cola Zéro", unitAmount: 290 },
  // ...
};

type ItemIn = { id: string | number; quantity: number; priceNumber?: number };

function toLineItems(items: ItemIn[], mode: "delivery" | "pickup"): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const it of items) {
    const key = String(it.id);
    const ref = PRICE_CATALOG[key];

    if (ref) {
      line_items.push({
        quantity: it.quantity,
        price_data: {
          currency: "eur",
          unit_amount: ref.unitAmount,
          product_data: { name: ref.name },
        },
      });
      continue;
    }

    if (process.env.ALLOW_CLIENT_PRICES === "true" && typeof it.priceNumber === "number") {
      const cents = Math.round(it.priceNumber * 100);
      if (cents <= 0 || cents > 200_00) throw new Error(`Prix invalide pour l'article ${key}`);
      line_items.push({
        quantity: it.quantity,
        price_data: {
          currency: "eur",
          unit_amount: cents,
          product_data: { name: `Article ${key}` },
        },
      });
      continue;
    }

    throw new Error(`Unknown item id ${key}`);
  }

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

  return line_items;
}

type Locale = "fr" | "en" | "nl" | "auto";
function toStripeCheckoutLocale(loc: unknown): Locale {
  return typeof loc === "string" && (loc === "fr" || loc === "en" || loc === "nl") ? loc : "auto";
}

export async function POST(req: Request) {
  try {
    const { items, mode = "delivery", locale = "fr" } = (await req.json()) as {
      items: ItemIn[];
      mode?: "delivery" | "pickup";
      locale?: string;
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: toLineItems(items, mode),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/checkout/cancel`,
      locale: toStripeCheckoutLocale(locale),
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "create-checkout failed";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
