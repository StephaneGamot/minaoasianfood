// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/orderStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  // Sécurité minimale
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "bad id" }, { status: 400 });
  }

  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(order, { status: 200 });
}
