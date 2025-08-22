import { NextResponse } from "next/server";
import { getOrder } from "@/lib/orderStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ note: second param DESCTRUCTURÉ ({ params }) + typé inline
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "bad id" }, { status: 400 });
  }

  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(order, { status: 200 });
}
