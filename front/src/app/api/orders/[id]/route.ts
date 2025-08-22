// app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { getOrder } from "@/lib/orderStore";
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const order = await getOrder(params.id);
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(order);
}
