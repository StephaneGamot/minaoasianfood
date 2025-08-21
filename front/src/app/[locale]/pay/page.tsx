"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCart } from "@/context/CartContext";

import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementLocale } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { QRCodeCanvas } from "qrcode.react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type DeliveryMode = "delivery" | "pickup";
type Method = "stripe" | "qr" | "cash";

function toStripeElementLocale(loc: string): StripeElementLocale {
  switch (loc) {
    case "fr":
    case "en":
    case "nl":
      return loc;
    default:
      return "auto";
  }
}

export default function PayPage() {
  const { cart } = useCart();
  const locale = useLocale();
  const router = useRouter();
  const sp = useSearchParams();

  const [mode] = useState<DeliveryMode>((sp.get("mode") as DeliveryMode) || "delivery");
  const [method, setMethod] = useState<Method>("stripe");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.priceNumber * i.quantity, 0), [cart]);
  const deliveryFee = useMemo(() => (mode === "delivery" && cart.length ? 4.9 : 0), [mode, cart.length]);
  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  useEffect(() => {
    if (!cart.length) router.replace(`/${locale}/menu`);
  }, [cart.length, router, locale]);

  // Prépare PaymentIntent dès qu’on arrive (méthode Stripe)
  useEffect(() => {
    if (!cart.length || method !== "stripe") return;

    setLoading(true);
    setErrMsg(null);
    setClientSecret(null);

    const payload = {
      items: cart.map(i => ({ id: i.id, quantity: i.quantity, priceNumber: i.priceNumber })), // ✅ inclut priceNumber
      mode,
      metadata: { source: "pay-page" },
    };

    fetch("/api/pay/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error || "create-intent failed");
        setClientSecret(data.clientSecret || null);
      })
      .catch((e: unknown) => {
        const m = e instanceof Error ? e.message : "Impossible de préparer le paiement.";
        setErrMsg(m);
      })
      .finally(() => setLoading(false));
  }, [method, cart, mode]);

  // Prépare URL Checkout pour QR code
  const createQr = async () => {
    setLoading(true);
    setErrMsg(null);
    setQrUrl(null);

    try {
      const payload = {
        items: cart.map(i => ({ id: i.id, quantity: i.quantity, priceNumber: i.priceNumber })), // ✅ inclut priceNumber
        mode,
        locale,
      };
      const r = await fetch("/api/pay/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "create-checkout failed");
      setQrUrl(d.url || null);
    } catch (e: unknown) {
      const m = e instanceof Error ? e.message : "Impossible de générer le QR code.";
      setErrMsg(m);
    } finally {
      setLoading(false);
    }
  };

  const EUR = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }),
    [locale]
  );

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

      {/* Choix */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          onClick={() => setMethod("stripe")}
          className={`rounded-lg border p-3 text-left ${method === "stripe" ? "border-red-700 ring-1 ring-red-700" : "border-gray-300"}`}
        >
          <div className="font-medium">Carte / Bancontact / Wallets</div>
          <div className="text-xs text-gray-600">Visa, Mastercard, Bancontact, Apple Pay, Google Pay…</div>
        </button>

        <button
          onClick={() => setMethod("qr")}
          className={`rounded-lg border p-3 text-left ${method === "qr" ? "border-red-700 ring-1 ring-red-700" : "border-gray-300"}`}
        >
          <div className="font-medium">QR code (Checkout)</div>
          <div className="text-xs text-gray-600">Scannez et payez depuis votre téléphone</div>
        </button>

        <button
          onClick={() => setMethod("cash")}
          className={`rounded-lg border p-3 text-left ${method === "cash" ? "border-red-700 ring-1 ring-red-700" : "border-gray-300"}`}
        >
          <div className="font-medium">Espèces à la remise</div>
          <div className="text-xs text-gray-600">Vous payez lors du retrait/livraison</div>
        </button>
      </div>

      {/* Erreur lisible */}
      {errMsg && (
        <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {errMsg}
        </div>
      )}

      {/* Panneaux */}
      <div className="mt-8">
        {method === "stripe" && (
          clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                locale: toStripeElementLocale(locale),
                appearance: { labels: "floating" },
              }}
            >
              <StripePayForm />
            </Elements>
          ) : (
            <p className="text-sm text-gray-600">
              {loading ? "Préparation du paiement…" : "Impossible de préparer le paiement."}
            </p>
          )
        )}

        {method === "qr" && (
          <div className="rounded-lg border p-4">
            {!qrUrl ? (
              <button
                onClick={createQr}
                disabled={loading}
                className="rounded-md bg-red-900 px-4 py-2 text-white hover:bg-red-800 disabled:opacity-50"
              >
                Générer le QR code
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <QRCodeCanvas value={qrUrl} size={220} includeMargin />
                <a href={qrUrl} className="text-red-700 underline">Ouvrir la page de paiement</a>
                <p className="text-xs text-gray-600">Le QR mène vers Stripe Checkout sécurisé.</p>
              </div>
            )}
          </div>
        )}

        {method === "cash" && (
          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-700">
              Votre commande sera marquée <strong>à payer en espèces</strong> au retrait / à la livraison.
            </p>
            <button
              onClick={() => router.push(`/${locale}/checkout/success?cash=1`)}
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
  const router = useRouter();
  const locale = useLocale();
  const [submitting, setSubmitting] = useState(false);

  const onPay = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/checkout/success`,
      },
    });
    if (error) alert(error.message || "Paiement refusé.");
    setSubmitting(false);
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
      <p className="mt-2 text-xs text-gray-600">
        Apple Pay / Google Pay apparaissent automatiquement si disponibles.
      </p>
    </div>
  );
}
