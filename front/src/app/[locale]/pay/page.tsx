"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCart } from "@/context/CartContext";

import { loadStripe, type StripeElementLocale } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { QRCodeCanvas } from "qrcode.react";

// --- Stripe side (client) ---
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
const stripePromise = PUBLISHABLE_KEY ? loadStripe(PUBLISHABLE_KEY) : null;

type DeliveryMode = "delivery" | "pickup";
type Method = "stripe" | "qr" | "qr_bank" | "cash";

function toStripeElementLocale(loc: string): StripeElementLocale {
  return loc === "fr" || loc === "en" || loc === "nl" ? loc : "auto";
}

function cleanIban(iban: string) {
  return iban.replace(/\s+/g, "").toUpperCase();
}

function buildEpcPayload({
  creditorName,
  creditorIban,
  creditorBic,
  amountEur,
  remittanceText,
}: {
  creditorName: string;
  creditorIban: string;
  creditorBic?: string;
  amountEur: number;
  remittanceText: string;
}) {
  const lines = [
    "BCD",
    "001",
    "1",
    "SCT",
    (creditorBic ?? "").toUpperCase(),
    creditorName,
    cleanIban(creditorIban),
    `EUR${amountEur.toFixed(2)}`,
    "",
    "",
    remittanceText,
  ];
  return lines.join("\n");
}

function SepaQrPanel({ amount, orderRef }: { amount: number; orderRef: string }) {
  const name = process.env.NEXT_PUBLIC_CREDITOR_NAME ?? "Votre Société";
  const iban = process.env.NEXT_PUBLIC_CREDITOR_IBAN ?? "BE00 0000 0000 0000";
  const bic = process.env.NEXT_PUBLIC_CREDITOR_BIC ?? "";

  const epc = buildEpcPayload({
    creditorName: name,
    creditorIban: iban,
    creditorBic: bic,
    amountEur: amount,
    remittanceText: orderRef,
  });

  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-col items-center gap-4">
        <QRCodeCanvas value={epc} size={220} includeMargin />
        <div className="w-full text-sm text-gray-700">
          <p><strong>Bénéficiaire :</strong> {name}</p>
          <p><strong>IBAN :</strong> {iban}</p>
          {bic ? <p><strong>BIC :</strong> {bic}</p> : null}
          <p><strong>Montant :</strong> {amount.toFixed(2)} €</p>
          <p><strong>Communication :</strong> {orderRef}</p>
        </div>
        <p className="text-xs text-gray-600">
          Ce QR préremplit un <strong>virement SEPA</strong> dans votre app bancaire.
          Le traitement n’est pas instantané. Nous préparerons la commande après réception du paiement.
        </p>
      </div>
    </div>
  );
}

export default function PayPage() {
  const { cart, loaded } = useCart();
  const locale = useLocale();
  const router = useRouter();
  const sp = useSearchParams();

  const [mode] = useState<DeliveryMode>((sp.get("mode") as DeliveryMode) || "delivery");

  // ✅ par défaut : CASH (sinon la commande est créée en "stripe")
  const [method, setMethod] = useState<Method>("cash");

  // état commande
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderBankRef, setOrderBankRef] = useState<string | null>(null);

  // état paiement
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.priceNumber * i.quantity, 0), [cart]);
  const deliveryFee = useMemo(() => (mode === "delivery" && cart.length ? 4.9 : 0), [mode, cart.length]);
  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  // Redirection si panier vide (après hydratation)
  useEffect(() => {
    if (!loaded) return;
    if (!cart.length) router.replace(`/${locale}/menu`);
  }, [loaded, cart.length, router, locale]);

  // 🔄 si l’utilisateur change de méthode : on repart propre et on recrée une commande pour la bonne méthode
  useEffect(() => {
    setOrderId(null);
    setOrderBankRef(null);
    setClientSecret(null);
    setQrUrl(null);
    setErrMsg(null);
  }, [method]);

  // 1) créer la commande UNE fois pour la méthode courante
  useEffect(() => {
    if (!loaded || !cart.length || orderId == null && method === "stripe" && !PUBLISHABLE_KEY) {
      // si l'utilisateur a choisi "stripe" mais pas de clé client → on laissera un message plus bas
    }

    if (!loaded || !cart.length || orderId) return;

    (async () => {
      setErrMsg(null);

      // mappe la méthode UI vers la méthode ordre
      const orderMethod: "stripe" | "cash" | "qr_bank" =
        method === "qr_bank" ? "qr_bank" : method === "cash" ? "cash" : "stripe";

      const payload = {
        locale,
        mode,
        items: cart.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, priceNumber: i.priceNumber })),
        deliveryFee,
        shipping: JSON.parse(sessionStorage.getItem("checkoutShipping") || "{}"),
        method: orderMethod,
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
      if (d.bankRef) setOrderBankRef(String(d.bankRef));
    })().catch(err => {
      const m = err instanceof Error ? err.message : "create order failed";
      setErrMsg(m);
    });
  }, [loaded, cart, locale, mode, method, deliveryFee, orderId]);

  // 2) préparer le PaymentIntent (Stripe) quand method === "stripe" + orderId dispo
  useEffect(() => {
    if (!loaded || !cart.length || method !== "stripe" || !orderId) return;

    if (!PUBLISHABLE_KEY || !stripePromise) {
      setErrMsg("Le paiement par carte est temporairement indisponible.");
      return;
    }

    setLoading(true);
    setErrMsg(null);
    setClientSecret(null);

    const payload = {
      items: cart.map(i => ({ id: i.id, quantity: i.quantity, priceNumber: i.priceNumber, name: i.name })),
      mode,
      orderId, // lie l'intent à la commande (webhook)
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
  }, [loaded, method, cart, mode, orderId]);

  // 3) Stripe Checkout (QR) — si tu veux le remettre
  const createQr = async () => {
    setLoading(true);
    setErrMsg(null);
    setQrUrl(null);

    try {
      if (!orderId) throw new Error("Commande non créée (orderId manquant).");

      const payload = {
        items: cart.map(i => ({ id: i.id, quantity: i.quantity, priceNumber: i.priceNumber, name: i.name })),
        mode,
        locale,
        orderId,
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
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        {/* Carte / Bancontact */}
        <button
          onClick={() => setMethod("stripe")}
          className={`rounded-lg border p-3 text-left ${method === "stripe" ? "border-red-700 ring-1 ring-red-700" : "border-gray-300"}`}
          disabled={!PUBLISHABLE_KEY}
          title={!PUBLISHABLE_KEY ? "Paiement par carte indisponible" : undefined}
        >
          <div className="font-medium">Carte / Bancontact</div>
          <div className="text-xs text-gray-600">
            Visa, Mastercard, Bancontact, Apple Pay, Google Pay…
          </div>
          {!PUBLISHABLE_KEY && (
            <div className="mt-2 text-xs text-red-700">
              Indisponible (clé Stripe manquante)
            </div>
          )}
        </button>

        {/* Cash */}
        <button
          onClick={() => setMethod("cash")}
          className={`rounded-lg border p-3 text-left ${method === "cash" ? "border-red-700 ring-1 ring-red-700" : "border-gray-300"}`}
        >
          <div className="font-medium">Espèces à la remise</div>
          <div className="text-xs text-gray-600">Paiement au retrait/livraison</div>
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
          clientSecret && stripePromise ? (
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
              {loading
                ? "Préparation du paiement…"
                : !PUBLISHABLE_KEY
                  ? "Paiement par carte indisponible."
                  : "Impossible de préparer le paiement."}
            </p>
          )
        )}

        {/* (optionnels) réactive si besoin
        {method === "qr" && (
          <div className="rounded-lg border p-4">
            {!qrUrl ? (
              <button
                onClick={createQr}
                disabled={loading || !orderId}
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

        {method === "qr_bank" && (
          <SepaQrPanel
            amount={total}
            orderRef={orderBankRef ?? (orderId ? orderId : `CMD-${Date.now()}`)}
          />
        )}
        */}

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
  const locale = useLocale();
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onPay = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setErr(null);

    try {
      const origin = window.location.origin; // URL absolue
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
      <p className="mt-2 text-xs text-gray-600">
        Apple Pay / Google Pay apparaissent automatiquement si disponibles.
      </p>
    </div>
  );
}
