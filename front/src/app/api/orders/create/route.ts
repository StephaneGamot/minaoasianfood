// src/app/api/orders/create/route.ts
import { NextResponse } from "next/server";
import {
  type Order,
  type OrderItem,
  type Shipping,
  saveOrder,
  generateOrderId,
  generateBankRef,
} from "@/lib/orderStore";
import {
  getRestaurantConfig,
  isRestaurantId,
  type RestaurantId,
} from "@/lib/restaurants";
import { notifyRestaurantNewOrder } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InItem = {
  id: string | number;
  name: string;
  quantity: number;
  priceNumber?: number; // en euros
  imageSrc?: string;
};

type Payload = {
  locale?: string;
  mode?: "delivery" | "pickup";
  deliveryFee?: number; // euros
  items: InItem[];
  shipping?: Shipping;
  method?: "stripe" | "cash" | "qr_bank" | "qr"; // "qr" = Stripe Checkout (traité comme stripe)
  restaurantId?: RestaurantId; // optionnel → défaut resto_a si absent/invalid
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    // --- Normalisations / validations
    const restaurantId: RestaurantId = isRestaurantId(body.restaurantId)
      ? body.restaurantId
      : "resto_a";

    const locale = (body.locale || "fr").toLowerCase();
    const mode = body.mode ?? "delivery";

    const itemsIn = Array.isArray(body.items) ? body.items : [];
    if (!itemsIn.length) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    // --- Normalise les items
    const items: OrderItem[] = itemsIn.map((i) => {
      const q = Math.max(1, Math.floor(i.quantity || 1));
      const p = typeof i.priceNumber === "number" ? i.priceNumber : 0;
      return {
        id: i.id,
        name: i.name || `Article ${i.id}`, // ✅ template string corrigé
        quantity: q,
        unitPrice: p,
        imageSrc: i.imageSrc,
      };
    });

    // --- Totaux
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const deliveryFee =
      mode === "delivery"
        ? typeof body.deliveryFee === "number"
          ? body.deliveryFee
          : 4.9
        : 0;
    const total = Math.max(0, +(subtotal + deliveryFee).toFixed(2));

    // --- Méthode & statut initial
    const reqMethod: Order["paymentMethod"] =
      body.method === "qr" ? "stripe" : (body.method ?? "stripe");

    let paymentStatus: Order["paymentStatus"] = "pending";
    if (reqMethod === "qr_bank") paymentStatus = "awaiting_bank";
    // cash & stripe commencent en "pending"

    // --- Id / Réf
    const orderId = generateOrderId();
    const bankRef = reqMethod === "qr_bank" ? generateBankRef(orderId) : undefined;

    // --- Récup cfg resto (renvoyée dans la réponse)
    const cfg = getRestaurantConfig(restaurantId);

    // --- Objet ordre
    const order: Order = {
      id: orderId,
      createdAt: Date.now(),
      restaurantId, // ✅ stocke le resto choisi
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
    };

    // --- Persistance
    await saveOrder(order);

    // --- Email immédiat UNIQUEMENT pour cash / virement
    try {
      if (order.paymentMethod === "cash" || order.paymentMethod === "qr_bank") {
        await notifyRestaurantNewOrder(order);
      }
    } catch (e) {
      console.warn("[notifyRestaurantNewOrder] failed (non bloquant)", e);
    }

    // --- Réponse
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

