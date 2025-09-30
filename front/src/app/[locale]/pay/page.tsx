// src/app/[locale]/pay/page.tsx (ou ton chemin équivalent)
"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useCart } from "@/context/CartContext";
import { isRestaurantId, type RestaurantId } from "@/lib/restaurants";

import { loadStripe, type StripeElementLocale } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
const stripePromise = PUBLISHABLE_KEY ? loadStripe(PUBLISHABLE_KEY) : null;

type DeliveryMode = "delivery" | "pickup";
type Method = "stripe" | "cash";
const SESSION_RESTO_KEY = "checkoutRestaurantId";

function toStripeElementLocale(loc: string): StripeElementLocale {
  return loc === "fr" || loc === "en" || loc === "nl" ? loc : "auto";
}

export default function PayPage() {
  const { cart, loaded, clearCart } = useCart();
  const router = useRouter();
  const sp = useSearchParams();
  const locale = useLocale();

  const [mode] = useState<DeliveryMode>((sp.get("mode") as DeliveryMode) || "delivery");
  const [method, setMethod] = useState<Method | null>(null);
  const [restaurantId, setRestaurantId] = useState<RestaurantId>("resto_a");

  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const rParam = sp.get("r");
useEffect(() => {
  if (isRestaurantId(rParam)) {
    sessionStorage.setItem("checkoutRestaurantId", rParam); // harmonise la source de vérité
  }
}, [rParam]);

  // Redirection si panier vide
  useEffect(() => {
    if (!loaded) return;
    if (!cart.length) router.replace(`/${locale}/menu`);
  }, [loaded, cart.length, router, locale]);

  // Relit le resto choisi
  useEffect(() => {
    const v = sessionStorage.getItem(SESSION_RESTO_KEY);
    if (isRestaurantId(v)) setRestaurantId(v);
  }, []);

  const deliveryFee = useMemo(() => (mode === "delivery" && cart.length ? 4.9 : 0), [mode, cart.length]);
  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.priceNumber * i.quantity, 0), [cart]);
  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);
  const EUR = useMemo(() => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }), [locale]);

  const chooseMethod = async (m: Method) => {
    setMethod(m);
    setOrderId(null);
    setClientSecret(null);
    setErrMsg(null);

    try {
      setLoading(true);
      const shipping = JSON.parse(sessionStorage.getItem("checkoutShipping") || "{}");

      const payload = {
        locale,
        mode,
        restaurantId, // 👈 important
        items: cart.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, priceNumber: i.priceNumber })),
        deliveryFee,
        shipping,
        method: m, // "cash" ou "stripe"
      };

      const r = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "create order failed");

      setOrderId(String(d.orderId));
      sessionStorage.setItem("lastOrderId", String(d.orderId));

      if (m === "stripe") {
        if (!PUBLISHABLE_KEY || !stripePromise) {
          throw new Error("Le paiement par carte est indisponible (clé publique manquante).");
        }
        const r2 = await fetch("/api/pay/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: payload.items,
            mode,
            orderId: d.orderId,
            metadata: { source: "pay-page" },
          }),
        });
        const d2 = await r2.json();
        if (!r2.ok) throw new Error(d2?.error || "create-intent failed");
        setClientSecret(d2.clientSecret || null);
      }
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : "Action impossible.");
      setMethod(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">Choisissez votre moyen de paiement</h1>

      <div className="mt-6 rounded-lg border p-4">
        <div className="flex justify-between text-sm">
          <span>Sous-total</span>
          <span>{EUR.format(subtotal)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span>Frais {mode === "delivery" ? "de livraison" : "de retrait"}</span>
          <span>{EUR.format(deliveryFee)}</span>
        </div>
        <div className="mt-2 flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{EUR.format(total)}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/*   <button
          onClick={() => chooseMethod("stripe")}
          className={`rounded-lg border p-3 text-left ${method === "stripe" ? "border-red-700 ring-1 ring-red-700" : "border-gray-300"}`}
          disabled={!PUBLISHABLE_KEY || loading}
          title={!PUBLISHABLE_KEY ? "Paiement par carte indisponible (clé Stripe manquante)" : undefined}
        >
          <div className="font-medium">Carte / Bancontact</div>
          <div className="text-xs text-gray-600">Visa, Mastercard, Bancontact, Apple Pay, Google Pay…</div>
        </button>  */}

        <button
          onClick={() => chooseMethod("cash")}
          className={`rounded-lg border p-3 text-left ${method === "cash" ? "border-red-700 ring-1 ring-red-700" : "border-gray-300"}`}
          disabled={loading}
        >
          <div className="font-medium">Espèces à la remise</div>
          <div className="text-xs text-gray-600">Paiement au retrait/livraison</div>
        </button>
      </div>

      {errMsg && (
        <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">{errMsg}</div>
      )}

      <div className="mt-8">
        {method === "stripe" && (
          clientSecret && stripePromise ? (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, locale: toStripeElementLocale(locale), appearance: { labels: "floating" } }}
            >
              <StripePayForm />
            </Elements>
          ) : (
            <p className="text-sm text-gray-600">
              {loading ? "Préparation du paiement…" : "Choisissez un moyen de paiement pour continuer."}
            </p>
          )
        )}

        {method === "cash" && orderId && (
          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-700">
              Votre commande <strong>{orderId}</strong> est enregistrée pour le restaurant sélectionné. Vous paierez en espèces au retrait / à la livraison.
            </p>
            <button
              onClick={() => {
                clearCart();
                router.push(`/${locale}/checkout/success?cash=1&oid=${encodeURIComponent(orderId)}`);
              }}
              className="mt-4 rounded-md bg-red-900 px-4 py-2 text-white hover:bg-red-800"
            >
              Confirmer et terminer
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function StripePayForm() {
  const stripe = useStripe();
  const elements = useElements();
  const locale = useLocale();
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onPay = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setErr(null);

    try {
      const origin = window.location.origin;
      const oid = sessionStorage.getItem("lastOrderId") || "";
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${origin}/${locale}/checkout/success${oid ? `?oid=${encodeURIComponent(oid)}` : ""}`,
        },
      });
      if (error) setErr(error.message || "Paiement refusé.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border p-4">
      <PaymentElement />
      <button
        onClick={onPay}
        disabled={!stripe || submitting}
        className="mt-4 w-full rounded-md bg-red-900 px-4 py-3 text-white hover:bg-red-800 disabled:opacity-50"
      >
        {submitting ? "Traitement…" : "Payer maintenant"}
      </button>
      {err && <p className="mt-2 text-sm text-red-700">{err}</p>}
      <p className="mt-2 text-xs text-gray-600">Apple Pay / Google Pay apparaissent automatiquement si disponibles.</p>
    </div>
  );
}
