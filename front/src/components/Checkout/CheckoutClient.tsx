"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

type DeliveryMode = "delivery" | "pickup";

export default function CheckoutClient() {
  const { cart, removeFromCart } = useCart();
  const [mode, setMode] = useState<DeliveryMode>("delivery");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const deliveryFee = mode === "delivery" && cart.length ? 4.9 : 0;

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.priceNumber * item.quantity, 0),
    [cart]
  );

  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  const EUR = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }),
    [locale]
  );

  const isDisabled = cart.length === 0 || loading;

 async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (isDisabled) return;
  setLoading(true);

  try {
    const fd = new FormData(e.currentTarget);
    const payload = {
      locale,
      mode,
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        priceNumber: i.priceNumber,
        quantity: i.quantity,
        imageSrc: i.imageSrc,
      })),
      shipping:
        mode === "delivery"
          ? {
              firstName: String(fd.get("firstName") || ""),
              lastName: String(fd.get("lastName") || ""),
              address: String(fd.get("address") || ""),
              postalCode: String(fd.get("postalCode") || ""),
              city: String(fd.get("city") || ""),
              phone: String(fd.get("phone") || ""),
              email: String(fd.get("email") || ""), 
            }
          : {},
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Checkout failed");
    const { url } = await res.json();

    // 👉 Redirection immédiate vers Stripe
    window.location.href = url;
  } catch (err) {
    console.error(err);
    setLoading(false);
    alert("Impossible de créer le paiement pour le moment.");
  }
}


  return (
    <form className="mt-8" onSubmit={onSubmit} noValidate>
      {/* Résumé commande */}
      <section aria-labelledby="order-heading" className="rounded-lg border border-gray-200">
        <h2 id="order-heading" className="sr-only">Résumé de la commande</h2>

        <ul role="list" className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item.id} className="flex items-start gap-4 p-4">
              <div className="shrink-0">
                <Image
                  src={item.imageSrc}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="size-24 rounded-md object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Qté : {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {EUR.format(item.priceNumber * item.quantity)}
                  </p>
                </div>

                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm font-medium text-red-700 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </li>
          ))}

          {/* Totaux */}
          <li className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Sous-total</span>
                <span>{EUR.format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Frais {mode === "delivery" ? "de livraison" : "de retrait"}</span>
                <span>{EUR.format(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>{EUR.format(total)}</span>
              </div>
            </div>
          </li>
        </ul>
      </section>

      {/* Mode de réception */}
      <fieldset className="mt-8 rounded-lg border border-gray-200 p-4">
        <legend className="text-sm font-semibold text-gray-900">Mode de réception</legend>
        <div className="mt-3 space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryMode"
              value="delivery"
              checked={mode === "delivery"}
              onChange={() => setMode("delivery")}
            />
            <span>Livraison</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryMode"
              value="pickup"
              checked={mode === "pickup"}
              onChange={() => setMode("pickup")}
            />
            <span>À emporter</span>
          </label>
        </div>
      </fieldset>

      {/* Coordonnées livraison (affichées si livraison) */}
      {mode === "delivery" && (
        <section className="mt-8 rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">Informations de livraison</h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm text-gray-700">Prénom</label>
              <input
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm text-gray-700">Nom</label>
              <input
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm text-gray-700">Adresse</label>
              <input
                id="address"
                name="address"
                autoComplete="street-address"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm text-gray-700">Code postal</label>
              <input
                id="postalCode"
                name="postalCode"
                autoComplete="postal-code"
                required
                inputMode="numeric"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm text-gray-700">Ville</label>
              <input
                id="city"
                name="city"
                autoComplete="address-level2"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm text-gray-700">Téléphone</label>
              <input
                id="phone"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </section>
      )}

      {/* CTA paiement */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={isDisabled}
          className="w-full rounded-md bg-red-900 px-4 py-3 text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Redirection…" : "Procéder au paiement"}
        </button>
        {cart.length === 0 && (
          <p role="status" aria-live="polite" className="mt-2 text-center text-sm text-gray-500">
            Votre panier est vide.
          </p>
        )}
      </div>
    </form>
  );
}
