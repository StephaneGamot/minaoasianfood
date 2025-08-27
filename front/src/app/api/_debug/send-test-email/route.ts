// src/app/api/_debug/send-test-email/route.ts
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
    // bankRef: undefined
  };
}

export async function GET() {
  try {
    await notifyRestaurantNewOrder(buildTestOrder("TEST-CMD-A", "resto_a"));
    await notifyRestaurantNewOrder(buildTestOrder("TEST-CMD-B", "resto_b"));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown error" },
      { status: 500 }
    );
  }
}
