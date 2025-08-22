import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Catalogue (remplace par ta BDD ou des Price IDs)
const PRICE_CATALOG: Record<string, { name: string; unitAmount: number }> = {
  "1": { name: "Ritchie Cola Natural", unitAmount: 290 },
  "2": { name: "Ritchie Cola Zéro", unitAmount: 290 },
  "3": { name: "Article 3", unitAmount: 790 }, // 7,90 €
};

type DeliveryMode = "delivery" | "pickup";
type ItemIn = { id: string | number; quantity: number; priceNumber?: number };

type CreateIntentPayload = {
  items: ItemIn[];
  mode?: DeliveryMode;
  currency?: string;
  metadata?: Record<string, string>;
  orderId?: string;
};

function getStripe(): Stripe {
  // supprime un éventuel commentaire inline après la valeur
  const rawLine = process.env.STRIPE_SECRET_KEY || "";
  const raw = rawLine.split("#")[0].trim();

  if (!raw) throw new Error("Server misconfiguration: STRIPE_SECRET_KEY is missing.");
  if (raw.includes("...")) {
    throw new Error("Server misconfiguration: STRIPE_SECRET_KEY contains '...'. Remove placeholder.");
  }
  if (!/^sk_(live|test)_[A-Za-z0-9]+$/.test(raw)) {
    throw new Error("Server misconfiguration: STRIPE_SECRET_KEY must start with sk_test_ or sk_live_.");
  }

  return new Stripe(raw);
}


function computeAmount(items: ItemIn[], mode: DeliveryMode) {
  let total = 0;
  for (const it of items) {
    const key = String(it.id);
    const ref = PRICE_CATALOG[key];

    if (ref) {
      total += ref.unitAmount * it.quantity;
      continue;
    }
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
    const body = (await req.json()) as CreateIntentPayload;

    const stripe = getStripe(); // ✅ instanciation dans POST

    const items = body.items ?? [];
    const mode: DeliveryMode = body.mode ?? "delivery";
    const currency = body.currency ?? "eur";
    const metadata = body.metadata ?? {};
    const orderId = body.orderId;

    if (!items.length) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    const amount = computeAmount(items, mode);
    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount calculated" }, { status: 400 });
    }

    const pi = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true }, // cartes, Bancontact, wallets
      metadata: { mode, ...(orderId ? { orderId } : {}), ...metadata },
    });

    if (!pi.client_secret) throw new Error("Stripe did not return client_secret");

    return NextResponse.json({ clientSecret: pi.client_secret }, { status: 200 });
  } catch (e: unknown) {
    console.error("[create-intent]", e);
    const msg = e instanceof Error ? e.message : "create-intent failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
