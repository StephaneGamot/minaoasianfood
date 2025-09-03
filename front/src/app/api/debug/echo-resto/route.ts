// src/app/api/debug/echo-resto/route.ts
import { NextResponse } from "next/server";
import { getRestaurantConfig, getFallbackRestaurantEmail } from "@/lib/restaurants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const rid = url.searchParams.get("rid") || "resto_a";
  const cfg = getRestaurantConfig(rid);
  const fallback = getFallbackRestaurantEmail();

  return NextResponse.json({
    restaurantId: rid,
    cfg,
    fallback,
  });
}
