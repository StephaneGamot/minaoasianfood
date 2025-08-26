import { NextResponse } from "next/server";
import {
  type Order,
  type OrderItem,
  type Shipping,
  saveOrder,
  generateOrderId,
  generateBankRef,
} from "@/lib/orderStore";
import { getRestaurantConfig } from "@/lib/restaurants"; 
import { notifyRestaurantNewOrder } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InItem = {
  id: string | number;
  name: string;
  quantity: number;
  priceNumber?: number;
  imageSrc?: string;
};

type Payload = {
  locale?: string;
  mode?: "delivery" | "pickup";
  deliveryFee?: number;
  items: InItem[];
  shipping?: Shipping;
  method?: "stripe" | "cash" | "qr_bank" | "qr";
  restaurantId: "resto_a" | "resto_b";             
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
  const restaurantId = body.restaurantId === "resto_a" || body.restaurantId === "resto_b" ? body.restaurantId : "resto_a";
    const locale = (body.locale || "fr").toLowerCase();
    const mode = body.mode ?? "delivery";
    const itemsIn = Array.isArray(body.items) ? body.items : [];
    if (!itemsIn.length) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    const items: OrderItem[] = itemsIn.map((i) => {
      const q = Math.max(1, Math.floor(i.quantity || 1));
      const p = typeof i.priceNumber === "number" ? i.priceNumber : 0;
      return { id: i.id, name: i.name || `Article ${i.id}`, quantity: q, unitPrice: p, imageSrc: i.imageSrc };
    });

    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const deliveryFee = mode === "delivery" ? (typeof body.deliveryFee === "number" ? body.deliveryFee : 4.9) : 0;
    const total = Math.max(0, +(subtotal + deliveryFee).toFixed(2));

    const reqMethod: Order["paymentMethod"] = body.method === "qr" ? "stripe" : (body.method ?? "stripe");
    let paymentStatus: Order["paymentStatus"] = "pending";
    if (reqMethod === "qr_bank") paymentStatus = "awaiting_bank";

    const cfg = getRestaurantConfig(body.restaurantId); // 👈 choix du resto
    const orderId = generateOrderId();
    const bankRef = reqMethod === "qr_bank" ? generateBankRef(orderId) : undefined;

    const order: Order = {
      id: orderId,
      createdAt: Date.now(),
      locale,
      mode,
      paymentMethod: reqMethod,
      paymentStatus,
      subtotal: +subtotal.toFixed(2),
      deliveryFee: +deliveryFee.toFixed(2),
      total,
      shipping: body.shipping,
      items,
      bankRef,
         restaurantId,
             
    };

    await saveOrder(order);

    // Email immédiat uniquement si CASH ou VIREMENT
    try {
      if (order.paymentMethod === "cash" || order.paymentMethod === "qr_bank") {
        await notifyRestaurantNewOrder(order);
      }
    } catch (e) {
      console.warn("[notifyRestaurantNewOrder] failed (non bloquant)", e);
    }

    // Renvoie aussi les coordonnées bancaires du resto (utile si tu réactives le virement/QR)
    return NextResponse.json(
      {
        orderId: order.id,
        bankRef: order.bankRef ?? null,
        creditor: {
          name: cfg.creditorName,
          iban: cfg.iban,
          bic: cfg.bic ?? null,
        },
      },
      { status: 200 }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "create order failed";
    console.error("[/api/orders/create]", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

