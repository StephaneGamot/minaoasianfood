import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ⚠️ Laisse Stripe choisir sa version (évite le type error "2025-07-30.basil")
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Mini-catalogue serveur (remplace par ta BDD)
const PRICE_CATALOG: Record<string, { name: string; unitAmount: number }> = {
  "1": { name: "Ritchie Cola Natural", unitAmount: 290 },
  "2": { name: "Ritchie Cola Zéro", unitAmount: 290 },
  // ...
};

type ItemIn = { id: string | number; quantity: number; priceNumber?: number };

function computeAmount(items: ItemIn[], mode: "delivery" | "pickup") {
  let total = 0;
  for (const it of items) {
    const key = String(it.id);
    const ref = PRICE_CATALOG[key];

    if (ref) {
      total += ref.unitAmount * it.quantity;
      continue;
    }

    // 🔧 DEV fallback (à activer dans .env.local): ALLOW_CLIENT_PRICES=true
    if (process.env.ALLOW_CLIENT_PRICES === "true" && typeof it.priceNumber === "number") {
      const cents = Math.round(it.priceNumber * 100);
      if (cents <= 0 || cents > 200_00) throw new Error(`Prix invalide pour l'article ${key}`);
      total += cents * it.quantity;
      continue;
    }

    throw new Error(`Unknown item id ${key}`);
  }

  if (mode === "delivery") total += 490; // 4,90 €
  return total;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      items: ItemIn[];
      mode?: "delivery" | "pickup";
      currency?: string;
      metadata?: Record<string, string>;
    };

    const items = body.items ?? [];
    const mode = body.mode ?? "delivery";
    const currency = body.currency ?? "eur";
    const metadata = body.metadata ?? {};

    if (!items.length) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    const amount = computeAmount(items, mode);

    const pi = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true }, // cartes, Bancontact, wallets
      metadata: { mode, ...metadata },
    });

    return NextResponse.json({ clientSecret: pi.client_secret }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "create-intent failed";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
