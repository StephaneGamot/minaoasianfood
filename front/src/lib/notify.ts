// src/lib/notify.ts
import type { Order } from "./orderStore";
import { getRestaurantConfig, getFallbackRestaurantEmail, getEmailFrom } from "./restaurants";

// ---------- Types sûrs (pas de any) ----------
type SendOk = { ok: true; id: string; to: string[] };
type SendFail = { ok: false; error: string; to: string[] };
type SendResult = SendOk | SendFail;

// ---------- Helpers ----------
function stripQuotes(s: string): string {
  // Supprime des guillemets collés dans les .env : "mail@...", 'mail@...'
  return s.replace(/^["']+|["']+$/g, "").trim();
}

function normalizeTo(to: string | string[] | undefined | null): string[] {
  if (!to) return [];
  const arr = Array.isArray(to) ? to : [to];
  return arr
    .map((t) => stripQuotes(t))
    .filter(Boolean);
}

function isValidEmail(s: string): boolean {
  // vérif simple suffisant pour éviter les erreurs 422 Resend
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
    ...order.items.map(i => `- ${i.name} x${i.quantity} @ ${i.unitPrice.toFixed(2)} €`),
    order.bankRef ? `\nRéf. virement: ${order.bankRef}` : "",
  ].join("\n");
}

function resolveToEmail(restaurantId?: string): string | null {
  const cfg = getRestaurantConfig(restaurantId);
  // cfg.email peut contenir des guillemets si la valeur a été saisie avec "..."
  const email = cfg.email ? stripQuotes(cfg.email) : null;
  return email || getFallbackRestaurantEmail();
}

async function sendWithResend(params: {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = stripQuotes(params.from);
  const to = normalizeTo(params.to);

  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY missing", to };
  }
  if (!from) {
    return { ok: false, error: "Missing 'from' address", to };
  }
  if (to.length === 0 || !to.every(isValidEmail)) {
    return { ok: false, error: "Invalid 'to' address", to };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  try {
    const resp = await resend.emails.send({
      from,
      to,               // ← tableau d'emails normalisé
      subject: params.subject,
      text: params.text,
      // reply_to: "une@boite.reelle" // optionnel si tu veux recevoir les réponses
    });

    // Le SDK retourne { data?: { id: string }, error?: { name, message } }
    if ((resp as { error?: { message?: string } }).error) {
      const msg = (resp as { error: { message?: string } }).error.message || "Resend error";
      return { ok: false, error: msg, to };
    }

    const id = (resp as { data?: { id?: string } }).data?.id || "";
    if (!id) return { ok: false, error: "No id returned by Resend", to };

    return { ok: true, id, to };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown send error";
    return { ok: false, error: msg, to };
  }
}

// ---------- API publiques ----------
export async function notifyRestaurantNewOrder(order: Order): Promise<SendResult> {
  const toOne = resolveToEmail(order.restaurantId);
  const from = getEmailFrom(); // lit RESEND_FROM || fallback onboarding@resend.dev
  const subject =
    order.paymentStatus === "paid" && order.paymentMethod === "stripe"
      ? `✅ Paiement confirmé – ${order.id}`
      : `🆕 Nouvelle commande ${order.id} – ${order.paymentMethod} – ${order.total.toFixed(2)} €`;

  const text = summarize(order);

  if (!toOne) {
    return { ok: false, error: "No destination email configured", to: [] };
  }

  return await sendWithResend({ from, to: toOne, subject, text });
}

export async function notifyRestaurantPaymentUpdate(
  orderId: string,
  status: string,
  restaurantId?: string
): Promise<SendResult> {
  const toOne = resolveToEmail(restaurantId);
  const from = getEmailFrom();
  const subject = `Paiement ${status} – ${orderId}`;
  const text = `Le paiement de la commande ${orderId} est maintenant : ${status}`;

  if (!toOne) {
    return { ok: false, error: "No destination email configured", to: [] };
  }

  return await sendWithResend({ from, to: toOne, subject, text });
}
