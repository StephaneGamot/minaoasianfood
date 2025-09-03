// src/lib/notify.ts
import type { Order } from "./orderStore";
import {
  getRestaurantConfig,
  getFallbackRestaurantEmail,
  getEmailFrom,
} from "./restaurants";

/** Validation simple d’email (évite espaces/points erronés) */
function isValidEmail(v?: string | null): boolean {
  if (!v) return false;
  const s = String(v).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function summarize(order: Order): string {
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

type ResolveReason = "restaurant" | "fallback" | "invalid" | "missing";

/** Retourne l’adresse cible et la raison (routing/fallback/…) */
function resolveToEmail(restaurantId?: string): { to: string | null; reason: ResolveReason } {
  const cfg = getRestaurantConfig(restaurantId);
  const primary = cfg.email?.trim() || null;
  const fallback = getFallbackRestaurantEmail();

  if (isValidEmail(primary)) return { to: primary, reason: "restaurant" };
  if (isValidEmail(fallback)) return { to: fallback, reason: "fallback" };
  return { to: null, reason: primary ? "invalid" : "missing" };
}

/** Parse en toute sécurité la réponse du SDK Resend (schémas possibles). */
function parseResendResponse(
  res: unknown
): { id?: string; errorMessage?: string } {
  if (typeof res !== "object" || res === null) return {};

  const obj = res as Record<string, unknown>;

  // Certains retours ont directement "id"
  const idDirect = obj["id"];
  let id: string | undefined;
  if (typeof idDirect === "string") id = idDirect;

  // D’autres ont "data: { id: string }"
  if (!id) {
    const data = obj["data"];
    if (typeof data === "object" && data !== null) {
      const dataId = (data as Record<string, unknown>)["id"];
      if (typeof dataId === "string") id = dataId;
    }
  }

  // Erreur éventuelle sous "error"
  const err = obj["error"];
  let errorMessage: string | undefined;
  if (typeof err === "object" && err !== null) {
    const errObj = err as Record<string, unknown>;
    if (typeof errObj["message"] === "string") errorMessage = errObj["message"];
    else if (typeof errObj["name"] === "string") errorMessage = errObj["name"];
  }

  return { id, errorMessage };
}

/** Envoi via Resend (sans `any`) */
async function sendWithResend(
  to: string,
  subject: string,
  text: string
): Promise<{ id?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    console.log("[EMAIL] RESEND_API_KEY absent → log only", { to, subject });
    return {};
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const from = getEmailFrom();

  const raw = await resend.emails.send({ from, to, subject, text });
  const { id, errorMessage } = parseResendResponse(raw);

  if (errorMessage) {
    console.error("[EMAIL] Resend error:", errorMessage);
    throw new Error(errorMessage);
  }

  console.log("[EMAIL] sent via Resend:", { to, subject, id });
  return { id };
}

export async function notifyRestaurantNewOrder(order: Order): Promise<void> {
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
): Promise<void> {
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
