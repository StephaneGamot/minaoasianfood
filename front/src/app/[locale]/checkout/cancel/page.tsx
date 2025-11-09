"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

export default function CheckoutCancelPage() {
  const locale = useLocale();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">Paiement annulé</h1>
      <p className="mt-3 text-gray-800">
        Votre paiement a été interrompu. Vous pouvez réessayer ou modifier votre commande.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/${locale}/pay`}
          className="inline-flex items-center justify-center rounded-md bg-[#f47457] px-4 py-2 text-white hover:bg-red-500"
        >
          Réessayer le paiement
        </Link>
        <Link
          href={`/${locale}/menu`}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50"
        >
          Retour au menu
        </Link>
      </div>
    </main>
  );
}
