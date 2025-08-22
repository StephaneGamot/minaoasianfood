// src/lib/notify.ts
import type { Order } from "./orderStore";

export async function notifyRestaurantNewOrder(order: Order) {
  const to = process.env.RESTAURANT_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  const subject = `Nouvelle commande ${order.id} – ${order.paymentMethod} – ${order.total.toFixed(2)} €`;

  if (!to || !apiKey) {
    console.log("[EMAIL->RESTAURANT]", subject, summarize(order));
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "Minao <onboarding@resend.dev>",
    to,
    subject,
    text: summarize(order),
  });
}

export async function notifyRestaurantPaymentUpdate(orderId: string, status: string) {
  const to = process.env.RESTAURANT_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!to || !apiKey) {
    console.log("[EMAIL->RESTAURANT] Payment update", orderId, status);
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "Minao <onboarding@resend.dev>",
    to,
    subject: `Paiement ${status} – ${orderId}`,
    text: `Le paiement de la commande ${orderId} est maintenant : ${status}`,
  });
}

function summarize(order: Order) {
  return [
    `Commande: ${order.id}`,
    `Date: ${new Date(order.createdAt).toLocaleString("fr-BE")}`,
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
