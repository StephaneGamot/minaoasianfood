'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "next-intl";
import Link from "next/link";

type Order = {
  id: string;
  paymentMethod: "stripe" | "cash" | "qr_bank";
  paymentStatus: "pending" | "paid" | "canceled" | "awaiting_bank";
  total: number;
  items: { name: string; quantity: number; unitPrice: number }[];
};

export default function SuccessPage() {
  const sp = useSearchParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const oid = sp.get("oid"); // 👈 récupère l’orderId si présent
  const cash = sp.get("cash") === "1";
  const locale = useLocale();

  useEffect(() => {
    // vide le panier une fois arrivé ici
    clearCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!oid) return;
    fetch(`/api/orders/${encodeURIComponent(oid)}`, { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [oid]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">Merci ! 🎉</h1>
      {cash ? (
        <p className="mt-2">Votre commande est confirmée. Vous paierez en espèces lors du retrait / de la livraison.</p>
      ) : (
        <p className="mt-2">Votre paiement a été pris en compte ou est en cours de validation.</p>
      )}

      {oid && <p className="mt-2">Référence commande : <strong>{oid}</strong></p>}

      {order && (
        <div className="mt-6 rounded border p-4">
          <h2 className="font-semibold">Récapitulatif</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {order.items.map((it, idx) => (
              <li key={idx}>{it.name} × {it.quantity} — {(it.unitPrice * it.quantity).toFixed(2)} €</li>
            ))}
          </ul>
          <p className="mt-3 font-semibold">Total : {order.total.toFixed(2)} €</p>
          <p className="text-xs text-gray-500 mt-2">
            (Si vous ne voyez rien ici en prod, vérifiez la config Upstash/Resend ci-dessous.)
          </p>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Link
          href={`/${locale}/menu`}
          className="inline-flex items-center justify-center rounded-md bg-[#f47457] px-4 py-2 text-white hover:bg-red-500"
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
    </main>
  );
}
