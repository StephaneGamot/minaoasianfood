import type { Metadata } from "next";

type Params = { locale: "fr" | "en" | "nl" };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    fr: "Paiement – Minao Asian Food",
    en: "Checkout – Minao Asian Food",
    nl: "Afrekenen – Minao Asian Food",
  } as const;

  const descriptions = {
    fr: "Vérifiez votre commande et renseignez vos informations pour finaliser le paiement.",
    en: "Review your order and enter your details to complete payment.",
    nl: "Controleer je bestelling en vul je gegevens in om te betalen.",
  } as const;

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}/checkout`,
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `/${locale}/checkout`,
      type: "website",
    },
  };
}

export default function CheckoutPage() {
  return (
    <main id="main" role="main" className="bg-white">
      {/* Client component qui gère le panier + formulaire */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-0">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Paiement</h1>
        <p className="mt-2 text-gray-600">
          Vérifiez les détails de votre commande et complétez vos informations.
        </p>

        <CheckoutClient />
      </section>
    </main>
  );
}

// ↓ Import “inline” pour éviter un import nommé en haut (Next l’accepte)
import CheckoutClient from "@/components/Checkout/CheckoutClient";

