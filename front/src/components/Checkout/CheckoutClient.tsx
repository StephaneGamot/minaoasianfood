// src/components/Checkout/CheckoutClient.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { RESTAURANTS, type RestaurantId, type RestaurantConfig } from "@/lib/restaurants";

type DeliveryMode = "delivery" | "pickup";
const SESSION_RESTO_KEY = "checkoutRestaurantId";

export default function CheckoutClient() {
  const { cart, removeFromCart } = useCart();
  const [mode, setMode] = useState<DeliveryMode>("delivery");
  const [restaurantId, setRestaurantId] = useState<RestaurantId | "">(() => {
    const saved = sessionStorage.getItem(SESSION_RESTO_KEY) as RestaurantId | null;
    return saved === "resto_a" || saved === "resto_b" ? saved : "";
  });
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

  const isDisabled = cart.length === 0 || loading || !restaurantId;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.preventDefault();
      form.reportValidity();
      return;
    }

    e.preventDefault();
    if (isDisabled) return;
    setLoading(true);

    try {
      const fd = new FormData(form);

      const shipping =
        mode === "delivery"
          ? {
              firstName: String(fd.get("firstName") ?? ""),
              lastName: String(fd.get("lastName") ?? ""),
              address: String(fd.get("address") ?? ""),
              postalCode: String(fd.get("postalCode") ?? ""),
              city: String(fd.get("city") ?? ""),
              phone: String(fd.get("phone") ?? ""),
              email: String(fd.get("email") ?? ""),
            }
          : {};

      sessionStorage.setItem("checkoutShipping", JSON.stringify(shipping));
      sessionStorage.setItem(SESSION_RESTO_KEY, restaurantId as RestaurantId);

      router.push(`/${locale}/pay?mode=${mode}`);
    } catch (err) {
      console.error(err);
      alert("Impossible de préparer le paiement pour le moment.");
    } finally {
      setLoading(false);
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

      {/* Choix du restaurant (obligatoire) */}
      <fieldset className="rounded-lg border border-gray-200 mt-5 p-4">
        <legend className="text-sm font-semibold text-gray-900">Choix du restaurant</legend>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(Object.values(RESTAURANTS) as RestaurantConfig[]).map((r) => (
            <label key={r.id} className="flex items-center gap-2 rounded-md border p-3">
              <input
                type="radio"
                name="restaurantId"
                value={r.id}
                checked={restaurantId === r.id}
                onChange={() => setRestaurantId(r.id)}
                required
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
        {!restaurantId && (
          <p className="mt-2 text-xs text-red-700">Veuillez choisir un restaurant pour continuer.</p>
        )}
      </fieldset>

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

      {/* Coordonnées livraison (requis si livraison) */}
      {mode === "delivery" && (
        <section className="mt-8 rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">Informations de livraison</h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm text-gray-700">Prénom</label>
              <input id="firstName" name="firstName" required className="mt-1 block w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm text-gray-700">Nom</label>
              <input id="lastName" name="lastName" required className="mt-1 block w-full rounded-md border px-3 py-2" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm text-gray-700">Adresse</label>
              <input id="address" name="address" required className="mt-1 block w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm text-gray-700">Code postal</label>
              <input id="postalCode" name="postalCode" required className="mt-1 block w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm text-gray-700">Ville</label>
              <input id="city" name="city" required className="mt-1 block w-full rounded-md border px-3 py-2" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm text-gray-700">Téléphone</label>
              <input id="phone" name="phone" required className="mt-1 block w-full rounded-md border px-3 py-2" />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={isDisabled}
          className="w-full rounded-md bg-red-900 px-4 py-3 text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Redirection…" : "Procéder au paiement"}
        </button>
        {!restaurantId && (
          <p className="mt-2 text-center text-sm text-red-700">Choisissez d’abord un restaurant.</p>
        )}
      </div>
    </form>
  );
}
