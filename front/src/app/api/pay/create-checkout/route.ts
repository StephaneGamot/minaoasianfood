import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Catalogue
const PRICE_CATALOG: Record<string, { name: string; unitAmount: number }> = {
  "1": { name: "Ritchie Cola Natural", unitAmount: 290 },
  "2": { name: "Ritchie Cola Zéro", unitAmount: 290 },
  "3": { name: "Article 3", unitAmount: 790 },
};

type DeliveryMode = "delivery" | "pickup";
type ItemIn = { id: string | number; quantity: number; priceNumber?: number; name?: string };

type CreateCheckoutPayload = {
  items: ItemIn[];
  mode?: DeliveryMode;
  locale?: string;
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


function toLineItems(
  items: ItemIn[],
  mode: DeliveryMode
): Stripe.Checkout.SessionCreateParams.LineItem[] {
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
          product_data: { name: it.name ?? `Article ${key}` },
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

type StripeLocale = "fr" | "en" | "nl" | "auto";
function toStripeCheckoutLocale(loc: unknown): StripeLocale {
  return typeof loc === "string" && (loc === "fr" || loc === "en" || loc === "nl") ? loc : "auto";
}

// ✅ base URL absolue
function getBaseUrl(req: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl) {
    try {
      return new URL(envUrl).origin;
    } catch {
      return `https://${envUrl}`;
    }
  }
  const originHeader = req.headers.get("origin");
  if (originHeader) return originHeader;
  const u = new URL(req.url);
  return u.origin;
}

export async function POST(req: Request) {
  try {
    const { items, mode = "delivery", locale = "fr", orderId } =
      (await req.json()) as CreateCheckoutPayload;

    const stripe = getStripe(); // ✅ instanciation dans POST

    if (!items?.length) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    const base = getBaseUrl(req);
const success = new URL(`/${locale}/checkout/success`, base);
if (orderId) success.searchParams.set("oid", orderId); // 👈 ajoute l’orderId
const cancel = new URL(`/${locale}/checkout/cancel`, base).toString();

const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: toLineItems(items, mode),
    success_url: success.toString(),
  cancel_url: cancel,
      locale: toStripeCheckoutLocale(locale),
      metadata: orderId ? { orderId } : undefined,
      client_reference_id: orderId || undefined,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: unknown) {
    console.error("[create-checkout]", e);
    const msg = e instanceof Error ? e.message : "create-checkout failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
