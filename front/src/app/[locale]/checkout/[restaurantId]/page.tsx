// src/app/[locale]/checkout/[restaurantId]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { getRestaurantConfig, isRestaurantId, type RestaurantId } from "@/lib/restaurants";

type DeliveryMode = "delivery" | "pickup";

export default function CheckoutReviewPage() {
  const { cart } = useCart();
  const params = useParams<{ locale: string; restaurantId: string }>();
  const router = useRouter();
  const sp = useSearchParams();
  const locale = useLocale();

  const ridParam = params?.restaurantId;
  const restaurantId: RestaurantId = isRestaurantId(ridParam) ? ridParam : "resto_a";
  const cfg = getRestaurantConfig(restaurantId);

  const mode: DeliveryMode = (sp.get("mode") as DeliveryMode) || "delivery";

  // protect if cart empty
  useEffect(() => {
    if (cart.length === 0) router.replace(`/${locale}/menu`);
  }, [cart.length, router, locale]);

  const deliveryFee = useMemo(() => (mode === "delivery" && cart.length ? 4.9 : 0), [mode, cart.length]);
  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.priceNumber * i.quantity, 0), [cart]);
  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);
  const EUR = useMemo(() => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }), [locale]);

  const [loadingCash, setLoadingCash] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // infos de livraison stockées à l’étape précédente
  const shipping = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("checkoutShipping") || "{}") as Record<string, string>;
    } catch {
      return {};
    }
  }, []);

  const proceedCash = async () => {
    setLoadingCash(true);
    setErrMsg(null);
    try {
      const payload = {
        locale,
        mode,
        restaurantId,
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          priceNumber: i.priceNumber,
        })),
        deliveryFee,
        shipping,
        method: "cash" as const,
      };

      const r = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "create order failed");

      // email au resto est envoyé par /api/orders/create pour CASH
      const oid = String(d.orderId);
      router.push(`/${locale}/checkout/success?cash=1&oid=${encodeURIComponent(oid)}`);
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : "Impossible de confirmer la commande.");
    } finally {
      setLoadingCash(false);
    }
  };

  const goCard = () => {
    // on passe le resto via query, la page /pay lira ?r=resto_a
    router.push(`/${locale}/pay?mode=${mode}&r=${restaurantId}`);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Confirmation – {cfg.label}</h1>

      {/* Infos resto */}
      <div className="mt-4 rounded-lg border p-4 text-sm text-gray-700">
        <div><strong>Email:</strong> {cfg.email || "—"}</div>
        {cfg.iban && <div><strong>IBAN:</strong> {cfg.iban} {cfg.bic ? `(BIC: ${cfg.bic})` : ""}</div>}
      </div>

      {/* Récap commande */}
      <section className="mt-6 rounded-lg border p-4">
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item.id} className="flex items-start gap-4 py-3">
              <div className="shrink-0">
                <Image src={item.imageSrc} alt={item.name} width={72} height={72} className="rounded-md object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-600">Qté : {item.quantity}</div>
                  </div>
                  <div className="text-sm">{EUR.format(item.priceNumber * item.quantity)}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Sous-total</span><span>{EUR.format(subtotal)}</span></div>
          <div className="flex justify-between"><span>Frais {mode === "delivery" ? "de livraison" : "de retrait"}</span><span>{EUR.format(deliveryFee)}</span></div>
          <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{EUR.format(total)}</span></div>
        </div>
      </section>

      {/* Coordonnées (si livraison) */}
      {mode === "delivery" && (
        <section className="mt-6 rounded-lg border p-4 text-sm">
          <div className="font-semibold mb-2">Informations de livraison</div>
          <div>{shipping.firstName} {shipping.lastName}</div>
          <div>{shipping.address}</div>
          <div>{shipping.postalCode} {shipping.city}</div>
          <div>{shipping.phone}</div>
          {shipping.email && <div>{shipping.email}</div>}
        </section>
      )}

      {/* Actions */}
      {errMsg && <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">{errMsg}</div>}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button onClick={goCard} className="rounded-lg border p-3 text-left hover:bg-gray-50">
          <div className="font-medium">Payer par carte / Bancontact</div>
          <div className="text-xs text-gray-600">Visa, Mastercard, Apple Pay, Google Pay…</div>
        </button>

        <button
          onClick={proceedCash}
          disabled={loadingCash}
          className="rounded-lg border p-3 text-left bg-red-900 text-white hover:bg-red-800 disabled:opacity-50"
        >
          {loadingCash ? "Confirmation…" : "Confirmer la commande (espèces à la remise)"}
        </button>
      </div>
    </main>
  );
}
