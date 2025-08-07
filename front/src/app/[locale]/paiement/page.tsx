import React from 'react'
import Pay from '@/components/Paiement/pay'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panier – Minao Asian Food",
  description: "Consultez votre panier : retrouvez vos plats sélectionnés avant de finaliser votre commande halal à Bruxelles.",
  alternates: {
    canonical: "https://www.minaoasianfood.com/fr/panier",
  },
  openGraph: {
    title: "Panier – Minao Asian Food",
    description: "Revoyez et ajustez votre panier avant de passer commande chez Minao Asian Food à Bruxelles.",
    url: "https://www.minaoasianfood.com/fr/panier",
    type: "website",
    siteName: "Minao Asian Food",
    locale: "fr_BE",
    images: [
      {
        url: "https://www.minaoasianfood.com/fr/images/commande/panier-commande.webp",
        width: 1200,
        height: 630,
        alt: "Panier de commande en ligne Minao prêt à être validé",
      },
    ],
  },
};

export default function PaiementPage() {
  return (
    <Pay />
  )
}
