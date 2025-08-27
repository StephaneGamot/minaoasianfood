// src/lib/notify.ts
import type { Order } from "./orderStore";
import {
  getRestaurantConfig,
  getFallbackRestaurantEmail,
  getEmailFrom,
} from "./restaurants";

// helpers de typage sûrs
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}
function errorToString(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (isRecord(err) && typeof err.message === "string") return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

// Résumé lisible de la commande
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

function resolveToEmail(restaurantId?: string): string | null {
  const cfg = getRestaurantConfig(restaurantId);
  const to = (cfg.email || getFallbackRestaurantEmail() || "").trim();
  return to || null;
}

// On ne dépend pas des types internes exacts de Resend, on reste "minimal"
type ResendSendResponse = {
  id?: string;
  // d'autres champs existent, mais non nécessaires ici
};

async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const from = getEmailFrom();

  if (!apiKey || !to) {
    console.log("[EMAIL FAKE SEND]", { to, from, subject, preview: text.slice(0, 120) });
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  try {
    const result = (await resend.emails.send({ from, to, subject, text })) as unknown;

    // log propre, sans any
    let id: string | undefined;
    if (isRecord(result) && typeof result.id === "string") {
      id = result.id;
    }
    console.log("[EMAIL SENT]", { to, subject, id: id ?? "(no id returned)" });
  } catch (err: unknown) {
    console.error("[EMAIL ERROR]", {
      to,
      subject,
      message: errorToString(err),
    });
    // On ne bloque pas le flux métier si l'email échoue.
  }
}

export async function notifyRestaurantNewOrder(order: Order): Promise<void> {
  const to = resolveToEmail(order.restaurantId);
  const subject =
    order.paymentStatus === "paid" && order.paymentMethod === "stripe"
      ? `✅ Paiement confirmé – ${order.id}`
      : `🆕 Nouvelle commande ${order.id} – ${order.paymentMethod} – ${order.total.toFixed(2)} €`;

  await sendEmail(to || "", subject, summarize(order));
}

export async function notifyRestaurantPaymentUpdate(
  orderId: string,
  status: string,
  restaurantId?: string
): Promise<void> {
  const to = resolveToEmail(restaurantId);
  const subject = `Paiement ${status} – ${orderId}`;
  const text = `Le paiement de la commande ${orderId} est maintenant : ${status}`;
  await sendEmail(to || "", subject, text);
}
