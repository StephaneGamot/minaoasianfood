import type { Metadata } from "next";
import React from "react";

import HomePageHero from "@/components/Heros/HomePageHero";
import WitchRestaurant from "@/components/WitchRestaurant/WitchRestaurant";
import MenuCategoriesSection from "@/components/Menu/MenuCategoriesSection";


type Locale = "fr" | "en" | "nl";
type Params = { locale: Locale };


const SLUG: Record<Locale, string> = {
  fr: "galerie",
  en: "galerie",
  nl: "galerie",
};

const TITLES: Record<Locale, string> = {
  fr: "Galerie – Minao Asian Food à Bruxelles",
  en: "Gallery – Minao Asian Food in Brussels",
  nl: "Galerij – Minao Asian Food in Brussel",
};

const DESCR: Record<Locale, string> = {
  fr: "Explorez notre galerie de plats asiatiques halal faits maison. Découvrez l’univers visuel de Minao à travers nos spécialités.",
  en: "Explore our gallery of homemade halal Asian dishes. Discover Minao’s visual universe through our specialties.",
  nl: "Ontdek onze galerij met halal Aziatische huisgemaakte gerechten. Verken de visuele wereld van Minao via onze specialiteiten.",
};

const OG_LOCALE: Record<Locale, string> = {
  fr: "fr_BE",
  en: "en_US",
  nl: "nl_BE",
};

// ⚠️ Cette page définit SON canonical ; le layout NE DOIT PAS définir de canonical.
export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale } = await params;

  // Base site (utilisée par Next pour absolutiser les URLs relatives)
  // En prod: définis NEXT_PUBLIC_SITE_URL=https://www.minaoasianfood.com
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.minaoasianfood.com";

  const path = `/${locale}/${SLUG[locale]}`;

  return {
    metadataBase: new URL(site),
    title: TITLES[locale],
    description: DESCR[locale],
    alternates: {
      // ✅ Canonical RELATIF (sera absolutisé avec metadataBase)
      canonical: path,
      // ✅ hreflang pour chaque langue (relatifs → absolutisés)
      languages: {
        fr: `/fr/${SLUG.fr}`,
        en: `/en/${SLUG.en}`,
        nl: `/nl/${SLUG.nl}`,
        "x-default": `/fr/${SLUG.fr}`,
      },
    },
    openGraph: {
      title: TITLES[locale],
      description: DESCR[locale],
      url: path,
      type: "website",
      siteName: "Minao Asian Food",
      locale: OG_LOCALE[locale],
      images: [
        {
          url: "/fr/images/gallery/gallery-preview.webp", // mets ton image OG
          width: 1200,
          height: 630,
          alt: "Galerie photo du restaurant et des plats Minao",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLES[locale],
      description: DESCR[locale],
      images: ["/fr/images/gallery/gallery-preview.webp"],
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
