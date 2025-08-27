// front/src/app/api/_debug/send-test-email/route.ts
import { NextResponse } from "next/server";
import { notifyRestaurantNewOrder } from "@/lib/notify";
import type { Order } from "@/lib/orderStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// (optionnel) protège la route avec un token: ajoute DEBUG_EMAIL_TOKEN dans Vercel
const REQUIRED_TOKEN = (process.env.DEBUG_EMAIL_TOKEN || "").trim();

type Resto = "resto_a" | "resto_b";
function isResto(v: unknown): v is Resto {
  return v === "resto_a" || v === "resto_b";
}

function buildTestOrder(id: string, restaurantId: Resto, paid = false): Order {
  return {
    id,
    createdAt: Date.now(),
    restaurantId,
    locale: "fr",
    mode: "pickup",
    paymentMethod: paid ? "stripe" : "cash",
    paymentStatus: paid ? "paid" : "pending",
    subtotal: 10,
    deliveryFee: 0,
    total: 10,
    shipping: {
      firstName: "Test",
      lastName: "Email",
      phone: "0485 00 00 00",
      email: "test@example.com",
      address: "Rue de Test 1",
      postalCode: "1000",
      city: "Bruxelles",
    },
    items: [{ id: "sku_test", name: "Article de test", unitPrice: 10, quantity: 1 }],
    // bankRef: undefined,
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // --- sécurité token (facultatif)
    if (REQUIRED_TOKEN && url.searchParams.get("token") !== REQUIRED_TOKEN) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    // ?r=resto_a|resto_b (si absent → envoie aux deux)
    const r = url.searchParams.get("r");
    const paid = url.searchParams.get("paid") === "1";

    if (isResto(r)) {
      await notifyRestaurantNewOrder(buildTestOrder(`TEST-${r.toUpperCase()}`, r, paid));
    } else {
      await notifyRestaurantNewOrder(buildTestOrder("TEST-A", "resto_a", paid));
      await notifyRestaurantNewOrder(buildTestOrder("TEST-B", "resto_b", paid));
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
