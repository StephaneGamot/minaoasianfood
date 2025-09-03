// src/app/api/debug/send-test-email/route.ts
import { NextResponse } from "next/server";
import { notifyRestaurantNewOrder } from "@/lib/notify";
import type { Order } from "@/lib/orderStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildTestOrder(id: string, restaurantId: "resto_a" | "resto_b"): Order {
  return {
    id,
    createdAt: Date.now(),
    restaurantId,
    locale: "fr",
    mode: "pickup",
    paymentMethod: "cash",
    paymentStatus: "pending",
    subtotal: 10,
    deliveryFee: 0,
    total: 10,
    shipping: { firstName: "Test", lastName: "Email" },
    items: [{ id: "1", name: "TEST ITEM", unitPrice: 10, quantity: 1 }],
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const rid = (url.searchParams.get("rid") || "resto_a") as "resto_a" | "resto_b";

  try {
    await notifyRestaurantNewOrder(buildTestOrder(`TEST-${rid}-${Date.now()}`, rid));
    return NextResponse.json({ ok: true, rid });
  } catch (e) {
    return NextResponse.json(
      { ok: false, rid, error: e instanceof Error ? e.message : "unknown error" },
      { status: 500 }
    );
  }
}
