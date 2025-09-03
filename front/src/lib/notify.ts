// src/lib/notify.ts
import type { Order } from "./orderStore";
import {
  getRestaurantConfig,
  getFallbackRestaurantEmail,
  getEmailFrom,
} from "./restaurants";

function isValidEmail(v?: string | null) {
  if (!v) return false;
  const s = String(v).trim();
  // Regex simple; évite 99% des erreurs (espaces, point final, etc.)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function summarize(order: Order) {
  return [
    `Commande: ${order.id}`,
    `Date: ${new Date(order.createdAt).toLocaleString("fr-BE")}`,
    `Restaurant: ${order.restaurantId ?? "-"}`,
    `Mode: ${order.mode}`,
    `Paiement: ${order.paymentMethod} / ${order.paymentStatus}`,
    `Sous-total: ${order.subtotal.toFixed(2)} €`,
    `Livraison: ${order.deliveryFee.toFixed(2)} €`,
    `Total: ${order.total.toFixed(2)} €`,
    `Client: ${order.shipping?.firstName ?? ""} ${order.shipping?.lastName ?? ""}`,
    `Email: ${order.shipping?.email ?? ""} | Tel: ${order.shipping?.phone ?? ""}`,
    `Adresse: ${order.shipping?.address ?? ""}, ${order.shipping?.postalCode ?? ""} ${order.shipping?.city ?? ""}`,
    "",
    "Articles:",
    ...order.items.map((i) => `- ${i.name} x${i.quantity} @ ${i.unitPrice.toFixed(2)} €`),
    order.bankRef ? `\nRéf. virement: ${order.bankRef}` : "",
  ].join("\n");
}

function resolveToEmail(restaurantId?: string): { to: string | null; reason: string } {
  const cfg = getRestaurantConfig(restaurantId);
  const primary = cfg.email?.trim() || null;
  const fallback = getFallbackRestaurantEmail();

  if (isValidEmail(primary)) return { to: primary, reason: "restaurant" };
  if (isValidEmail(fallback)) return { to: fallback, reason: "fallback" };
  return { to: null, reason: primary ? "invalid" : "missing" };
}

async function sendWithResend(to: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.log("[EMAIL] RESEND_API_KEY absent → log only", { to, subject });
    return { id: "no-api-key-log-only" };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const from = getEmailFrom();

  const res = await resend.emails.send({ from, to, subject, text });
  // Resend renvoie { id, error? }
  if ((res as any)?.error) {
    console.error("[EMAIL] Resend error:", (res as any).error);
    throw new Error((res as any).error?.message || "Resend send failed");
  }

  console.log("[EMAIL] sent via Resend:", { to, subject, id: (res as any)?.id });
  return res;
}

export async function notifyRestaurantNewOrder(order: Order) {
  const { to, reason } = resolveToEmail(order.restaurantId);
  const subject =
    order.paymentStatus === "paid" && order.paymentMethod === "stripe"
      ? `✅ Paiement confirmé – ${order.id}`
      : `🆕 Nouvelle commande ${order.id} – ${order.paymentMethod} – ${order.total.toFixed(2)} €`;

  const text = summarize(order);

  console.log("[EMAIL:new-order] resolve", {
    restaurantId: order.restaurantId,
    to,
    reason,
  });

  if (!to) {
    console.warn("[EMAIL:new-order] pas de destinataire valable → log only");
    console.log("[EMAIL:new-order] WOULD SEND", { subject, text });
    return;
  }

  await sendWithResend(to, subject, text);
}

export async function notifyRestaurantPaymentUpdate(
  orderId: string,
  status: string,
  restaurantId?: string
) {
  const { to, reason } = resolveToEmail(restaurantId);
  const subject = `Paiement ${status} – ${orderId}`;
  const text = `Le paiement de la commande ${orderId} est maintenant : ${status}`;

  console.log("[EMAIL:payment-update] resolve", { restaurantId, to, reason });

  if (!to) {
    console.warn("[EMAIL:payment-update] pas de destinataire valable → log only");
    console.log("[EMAIL:payment-update] WOULD SEND", { subject, text });
    return;
  }

  await sendWithResend(to, subject, text);
}
