import type { Order } from "./orderStore";
import { resolveRestaurant } from "./restaurants";

function summarize(order: Order) {
  return [
    `Commande: ${order.id}`,
    `Date: ${new Date(order.createdAt).toLocaleString("fr-BE")}`,
    `Restaurant: ${resolveRestaurant(order.restaurantId).label}`,
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

function getToEmail(order: Order) {
  const cfg = resolveRestaurant(order.restaurantId);
  const fallback = process.env.RESTAURANT_EMAIL;
  return cfg.email || fallback || "";
}

export async function notifyRestaurantNewOrder(order: Order) {
  const to = getToEmail(order);
  if (!to || !process.env.RESEND_API_KEY) {
    console.log("[EMAIL->RESTAURANT] (dev)", to, summarize(order));
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Minao <noreply@minaoasianfood.com>",
    to,
    subject: `Nouvelle commande ${order.id} – ${order.paymentMethod} – ${order.total.toFixed(2)} € – ${resolveRestaurant(order.restaurantId).label}`,
    text: summarize(order),
  });
}

export async function notifyRestaurantPaymentUpdate(orderId: string, status: string, restaurantId?: Order["restaurantId"]) {
  const to =
    (restaurantId ? resolveRestaurant(restaurantId).email : "") ||
    process.env.RESTAURANT_EMAIL ||
    "";
  if (!to || !process.env.RESEND_API_KEY) {
    console.log("[EMAIL->RESTAURANT] Payment update", to, orderId, status);
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Minao <noreply@minaoasianfood.com>",
    to,
    subject: `Paiement ${status} – ${orderId}`,
    text: `Le paiement de la commande ${orderId} est maintenant : ${status}`,
  });
}
