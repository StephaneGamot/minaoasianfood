"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLocale } from "next-intl";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const sp = useSearchParams();
  const locale = useLocale();
  const [cleared, setCleared] = useState(false);

  // orderId transmis par le return_url (Payment Element / Checkout)
  // ou récupéré si l’utilisateur recharge la page
  const oid = useMemo(() => {
    const fromQuery = sp.get("oid");
    if (fromQuery) return fromQuery;
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("lastOrderId") || "";
    }
    return "";
  }, [sp]);

  const isCash = sp.get("cash") === "1";

  // Vider le panier une seule fois à l’arrivée
  useEffect(() => {
    if (cleared) return;
    try {
      clearCart();
      sessionStorage.removeItem("checkoutShipping");
      // tu peux aussi effacer lastOrderId si tu ne veux pas qu’il persiste :
      // sessionStorage.removeItem("lastOrderId");
    } finally {
      setCleared(true);
    }
  }, [cleared, clearCart]);

  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">Merci ! 🎉</h1>

      <p className="mt-3 text-gray-800">
        {isCash
          ? "Votre commande est confirmée. Vous paierez en espèces lors du retrait / de la livraison."
          : "Votre paiement a été pris en compte ou est en cours de confirmation par Stripe."}
      </p>

      {oid ? (
        <p className="mt-2 text-gray-700">
          Référence commande : <strong>{oid}</strong>
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/${locale}/menu`}
          className="inline-flex items-center justify-center rounded-md bg-red-900 px-4 py-2 text-white hover:bg-red-800"
        >
          Revenir au menu
        </Link>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50"
        >
          Accueil
        </Link>
      </div>

      <p className="mt-6 text-xs text-gray-500">
        Un e-mail de confirmation est envoyé au restaurant. Si vous avez un souci,
        répondez à cet e-mail avec votre référence de commande.
      </p>
    </main>
  );
}

