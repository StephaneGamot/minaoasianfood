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

  const TITLES = {
    fr: "Minao Asian Food – Restaurant asiatique halal à Bruxelles",
    en: "Minao Asian Food – Halal Asian restaurant in Brussels",
    nl: "Minao Asian Food – Halal Aziatisch restaurant in Brussel",
  } as const;

  const DESCR = {
    fr: "Savourez une cuisine asiatique halal authentique à Bruxelles. Plats thaï, nouilles, riz sautés et desserts maison dans un cadre chaleureux.",
    en: "Enjoy authentic halal Asian cuisine in Brussels. Thai dishes, noodles, fried rice and homemade desserts in a warm setting.",
    nl: "Geniet van authentieke halal Aziatische keuken in Brussel. Thaise gerechten, noedels, gebakken rijst en huisgemaakte desserts in een warme sfeer.",
  } as const;

  const OG_LOCALE = {
    fr: "fr_BE",
    en: "en_US",
    nl: "nl_BE",
  } as const;

  // ✅ Ne JAMAIS retomber sur localhost en prod
  const site = "https://www.minaoasianfood.com";

  const base = new URL(site);

  return {
    metadataBase: base,
    applicationName: "Minao Asian Food",

    // ✅ Titre & description localisés
    title: TITLES[locale],
    description: DESCR[locale],

    // ✅ Canonical spécifique à la home locale + hreflang
    alternates: {
      canonical: `/${locale}`, // sera absolutisé avec metadataBase
      languages: {
        fr: "/fr",
        en: "/en",
        nl: "/nl",
        "x-default": "/",
      },
    },

    // ✅ Open Graph propre
    openGraph: {
      title: TITLES[locale],
      description: DESCR[locale],
      url: `/${locale}`,
      type: "website",
      siteName: "Minao Asian Food",
      locale: OG_LOCALE[locale],
      images: [
        {
          url: "/images/menu/nouilles-sautees-boeuf.webp", // ⚠️ mets une image qui existe dans /public
          alt: TITLES[locale],
        },
      ],
    },

    // ✅ Twitter card
    twitter: {
      card: "summary_large_image",
      title: TITLES[locale],
      description: DESCR[locale],
      images: ["/images/menu/nouilles-sautees-boeuf.webp"],
      site: "@minaobrussels",
    },

    // (optionnel) robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
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
