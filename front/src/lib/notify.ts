import type { Order } from "./orderStore";
import {
  getRestaurantConfig,
  getFallbackRestaurantEmail,
  getEmailFrom,
} from "./restaurants";

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
  return cfg.email || getFallbackRestaurantEmail();
}

export async function notifyRestaurantNewOrder(order: Order) {
  const to = resolveToEmail(order.restaurantId);
  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  const subject =
    order.paymentStatus === "paid" && order.paymentMethod === "stripe"
      ? `✅ Paiement confirmé – ${order.id}`
      : `🆕 Nouvelle commande ${order.id} – ${order.paymentMethod} – ${order.total.toFixed(2)} €`;

  const text = summarize(order);

  // LOGS pour debug ciblé
  console.log("[EMAIL NEW ORDER] to=", to, "restaurantId=", order.restaurantId, "subject=", subject);

  if (!to || !apiKey) {
    console.log("[EMAIL->RESTAURANT FAKE SEND]", { to, subject, text });
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: getEmailFrom(),
    to,
    subject,
    text,
  });
  if (error) console.error("[Resend send error]", error);
}

export async function notifyRestaurantPaymentUpdate(orderId: string, status: string, restaurantId?: string) {
  const to = resolveToEmail(restaurantId);
  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  const subject = `Paiement ${status} – ${orderId}`;
  const text = `Le paiement de la commande ${orderId} est maintenant : ${status}`;

  console.log("[EMAIL PAY UPDATE] to=", to, "restaurantId=", restaurantId, "subject=", subject);

  if (!to || !apiKey) {
    console.log("[EMAIL->RESTAURANT Payment update FAKE SEND]", { to, subject, text });
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: getEmailFrom(),
    to,
    subject,
    text,
  });
  if (error) console.error("[Resend send error]", error);
}
