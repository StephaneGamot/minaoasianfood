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

  const siteUrl = "https://www.minaoasianfood.com";

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

  return {
    // Canonical absolu pour éviter toute fuite 'localhost'
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        fr: `${siteUrl}/fr`,
        en: `${siteUrl}/en`,
        nl: `${siteUrl}/nl`,
        "x-default": `${siteUrl}/fr`,
      },
    },
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${siteUrl}/${locale}`,
      siteName: "Minao Asian Food",
      type: "website",
      locale: locale === "fr" ? "fr_BE" : locale === "nl" ? "nl_BE" : "en_US",
      images: [
        {
          url: `${siteUrl}/images/menu/nouilles-sautees-boeuf.webp`,
          width: 1200,
          height: 630,
          alt: titles[locale],
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale],
      description: descriptions[locale],
      images: [`${siteUrl}/images/menu/nouilles-sautees-boeuf.webp`],
      site: "@minaobrussels",
    },
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
