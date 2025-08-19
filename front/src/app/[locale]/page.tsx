import type { Metadata } from "next";
import React from "react";

import HomePageHero from "@/components/Heros/HomePageHero";
import WitchRestaurant from "@/components/WitchRestaurant/WitchRestaurant";
import MenuCategoriesSection from "@/components/Menu/MenuCategoriesSection";

type Params = { locale: "fr" | "en" | "nl" };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    fr: "Minao Asian Food – Restaurant asiatique halal à Bruxelles",
    en: "Minao Asian Food – Halal Asian restaurant in Brussels",
    nl: "Minao Asian Food – Halal Aziatisch restaurant in Brussel",
  } as const;

  const descriptions = {
    fr: "Savourez une cuisine asiatique halal authentique à Bruxelles. Plats thaï, nouilles, riz sautés et desserts maison dans un cadre chaleureux.",
    en: "Enjoy authentic halal Asian cuisine in Brussels. Thai dishes, noodles, fried rice and homemade desserts in a warm setting.",
    nl: "Geniet van authentieke halal Aziatische keuken in Brussel. Thaise gerechten, noedels, gebakken rijst en huisgemaakte desserts in een warme sfeer.",
  } as const;

  // Base absolue fiable (prod via env, sinon domaine prod par défaut)
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.minaoasianfood.com";
  const base = new URL(site);

  return {
    title: titles[locale],
    description: descriptions[locale],
    // ✅ canonical spécifique à la home locale
    alternates: {
      canonical: `/${locale}`,
      // hreflang (Next les rendra absolus avec metadataBase)
      languages: { fr: "/fr", en: "/en", nl: "/nl", "x-default": "/" },
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `/${locale}`,
      siteName: "Minao Asian Food",
      type: "website",
      images: [
        { url: "/images/menu/nouilles-sautees-boeuf.webp", alt: titles[locale] }
      ],
    },
    twitter: { card: "summary_large_image" },
    metadataBase: base,
  };
}

export default function Homepage() {
  return (
    <main id="main" role="main" className="bg-stone-100">
      <HomePageHero />
      <WitchRestaurant />
      <MenuCategoriesSection />
    </main>
  );
}
