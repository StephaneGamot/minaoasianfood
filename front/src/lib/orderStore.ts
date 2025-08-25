// src/lib/orderStore.ts

// ---------- Types ----------
export type OrderItem = {
  id: string | number;
  name: string;
  unitPrice: number;   // en euros, ex: 7.9
  quantity: number;
  imageSrc?: string;
};

export type Shipping = {
  firstName?: string;
  lastName?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  email?: string;
};

export type Order = {
  id: string; // ex: CMD-ABC123
  createdAt: number; // Date.now()
  locale: string; // fr / nl / en
  mode: "delivery" | "pickup";
  paymentMethod: "stripe" | "cash" | "qr_bank";
  paymentStatus: "pending" | "paid" | "canceled" | "awaiting_bank";
  subtotal: number; // euros
  deliveryFee: number; // euros
  total: number; // euros
  shipping?: Shipping;
  items: OrderItem[];
  bankRef?: string;
  restaurantId: "resto_a" | "resto_b";
};

// ---------- Constantes ----------
const PREFIX = "order:";
const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 jours

// ---------- Fallback mémoire (dev) ----------
const mem = new Map<string, Order>();

// ---------- Helpers ----------
function isValidUrl(u?: string | null): boolean {
  try {
    if (!u) return false;
    const url = new URL(u);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function looksLikePlaceholder(s?: string | null): boolean {
  if (!s) return true;
  const v = s.trim().toLowerCase();
  return v.includes("xxx") || v.includes("...") || v.includes("<") || v.includes("your_");
}

const rawUrl = process.env.UPSTASH_REDIS_REST_URL ?? "";
const rawToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

const UPSTASH_URL = rawUrl.trim() || undefined;
const UPSTASH_TOKEN = rawToken.trim() || undefined;

const HAS_UPSTASH =
  !!UPSTASH_URL &&
  !!UPSTASH_TOKEN &&
  isValidUrl(UPSTASH_URL) &&
  !looksLikePlaceholder(UPSTASH_URL) &&
  !looksLikePlaceholder(UPSTASH_TOKEN);

// Pipeline Upstash typé
type UpstashPrimitive = string | number | boolean | null;
type UpstashCmd = [command: string, ...args: UpstashPrimitive[]];
type UpstashResult<R> = { result: R };

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

// Appel Upstash (typé, sans any)
async function upstash<R = unknown>(pipeline: UpstashCmd[]): Promise<UpstashResult<R>[]> {
  if (!HAS_UPSTASH) throw new Error("Upstash not configured");

  const res = await fetch(UPSTASH_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pipeline }),
    cache: "no-store",
  });

  const json = (await res.json().catch(() => null)) as unknown;

  if (!res.ok) {
    let message: string | undefined;
    if (isRecord(json)) {
      const errVal = json["error"];
      if (typeof errVal === "string") message = errVal;
    }
    throw new Error(message || `Upstash error (${res.status})`);
  }

  return json as UpstashResult<R>[];
}

// ---------- Utils ----------
function rand(n = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function generateOrderId(): string {
  return `CMD-${rand(3)}${Date.now().toString().slice(-5)}`;
}

export function generateBankRef(orderId: string): string {
  // Simple communication libre basée sur l’orderId
  return `REF-${orderId.replace(/[^A-Z0-9]/gi, "").slice(-12)}`;
}

// ---------- API ----------
export async function saveOrder(order: Order): Promise<void> {
  if (HAS_UPSTASH) {
    try {
      const key = PREFIX + order.id;
      const val = JSON.stringify(order);
      // "SET" -> "OK", "EXPIRE" -> 1
      await upstash<string | number>([
        ["SET", key, val],
        ["EXPIRE", key, TTL_SECONDS],
      ]);
      return;
    } catch (e) {
      console.warn(
        "[orderStore] Upstash save failed, fallback to memory:",
        (e as Error)?.message
      );
      // on retombe en mémoire
    }
  }
  mem.set(order.id, order);
}

export async function getOrder(orderId: string): Promise<Order | null> {
  if (HAS_UPSTASH) {
    try {
      const key = PREFIX + orderId;
      const [getRes] = await upstash<string | null>([["GET", key]]);
      if (!getRes || getRes.result == null) return null;
      try {
        return JSON.parse(getRes.result) as Order;
      } catch {
        return null;
      }
    } catch (e) {
      console.warn(
        "[orderStore] Upstash get failed, fallback to memory:",
        (e as Error)?.message
      );
      // fallback mémoire
    }
  }
  return mem.get(orderId) ?? null;
}

export async function updatePaymentStatus(
  orderId: string,
  status: Order["paymentStatus"]
): Promise<void> {
  const current = await getOrder(orderId);
  if (!current) return;
  const next: Order = { ...current, paymentStatus: status };
  await saveOrder(next);
}
