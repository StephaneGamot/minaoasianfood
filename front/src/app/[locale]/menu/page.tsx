import React from "react";
import Starters from "@/components/Menu/Starters/Starters";
import Noodles from "@/components/Menu/Noodles/Noodles";
import Rice from "@/components/Menu/Rices/Rice";
import PadThai from "@/components/Menu/PadThai/PadThai";
import SaucePlats from "@/components/Menu/SaucePlats/SaucePlats";
import Baos from "@/components/Menu/Baos/Baos";
import Desserts from "@/components/Menu/Desserts/Desserts"
import Boissons from "@/components/Menu/Boissons/Boissons";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carte Minao – Plats halal & asiatiques à Bruxelles",
  description: "Découvrez nos entrées, nouilles, pad thaï, riz sauté, baos et desserts halal préparés maison dans notre restaurant à Bruxelles.",
  alternates: {
    canonical: "https://www.minaoasianfood.com/fr/menu",
  },
  openGraph: {
    title: "Carte Minao – Plats halal & asiatiques à Bruxelles",
    description: "Nos plats faits maison : pad thaï, riz sauté, nouilles, bao et desserts halal pour régaler vos papilles.",
    url: "https://www.minaoasianfood.com/fr/menu",
    type: "website",
    siteName: "Minao Asian Food",
    locale: "fr_BE",
    images: [
      {
        url: "https://www.minaoasianfood.com/fr/images/menu/nouilles-sautees-boeuf.webp",
        width: 1200,
        height: 630,
        alt: "Nouilles sautées au bœuf dans un bol asiatique",
      },
    ],
  },
};


export default function page() {
  return (
    <section className="bg-white py-10 px-1 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Découvrez notre carte
        </h1>{" "}
      </div>

      <Starters />
      <Noodles />
      <Rice />
      <PadThai />
      <SaucePlats />
      <Baos />
      <Desserts />
      <Boissons />
    </section>
  );
}
