// app/[locale]/menu/page.tsx
import React from "react";
import Head from "next/head";
import Starters from "@/components/Menu/Starters/Starters";
import Noodles from "@/components/Menu/Noodles/Noodles";
import Rice from "@/components/Menu/Rices/Rice";
import PadThai from "@/components/Menu/PadThai/PadThai";
import SaucePlats from "@/components/Menu/SaucePlats/SaucePlats";
import Baos from "@/components/Menu/Baos/Baos";
import Desserts from "@/components/Menu/Desserts/Desserts";
import Boissons from "@/components/Menu/Boissons/Boissons";
import type { Metadata } from "next";

type Params = { locale: "fr" | "en" | "nl" };

// ── Metadata en FR pour toutes les locales (pas de retraduction)
export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale } = await params;

  const TITLES = {
    fr: "Carte Minao – Plats halal & asiatiques à Bruxelles",
    en: "Menu Minao – Halal & Asian dishes in Brussels",
    nl: "Menu Minao – Halal- en Aziatische gerechten in Brussel",
  } as const;

  const DESCR = {
    fr: "Découvrez nos entrées, nouilles, pad thaï, riz sauté, baos et desserts halal préparés maison dans notre restaurant à Bruxelles.",
    en: "Discover our starters, noodles, pad Thai, fried rice, baos and halal desserts, all homemade in our restaurant in Brussels.",
    nl: "Ontdek onze voorgerechten, noedels, pad thai, gebakken rijst, baos en halal-desserts, allemaal huisgemaakt in ons restaurant in Brussel.",
  } as const;

  const OG_LOCALE = {
    fr: "fr_BE",
    en: "en_GB",
    nl: "nl_BE",
  } as const;

  const site = "https://www.minaoasianfood.com";
  const base = new URL(site);
  const path = `/${locale}/menu`;

  return {
    metadataBase: base,
    applicationName: "Minao Asian Food",
    title: TITLES[locale],
    description: DESCR[locale],
    alternates: {
      canonical: path,
      languages: {
        fr: "/fr/menu",
        en: "/en/menu",
        nl: "/nl/menu",
        "x-default": "/fr/menu",
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
          url: "/images/menu/nouilles-sautees-boeuf.webp",
          width: 1200,
          height: 630,
          alt: "Nouilles sautées au bœuf dans un bol asiatique",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLES[locale],
      description: DESCR[locale],
      images: ["/images/menu/nouilles-sautees-boeuf.webp"],
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

export default function MenuPage() {
  const HREF = {
    fr: "https://www.minaoasianfood.com/fr/menu",
    en: "https://www.minaoasianfood.com/en/menu",
    nl: "https://www.minaoasianfood.com/nl/menu",
  } as const;

  return (
    <>
      <Head>
        <link rel="alternate" hrefLang="fr-BE" href={HREF.fr} />
        <link rel="alternate" hrefLang="en-GB" href={HREF.en} />
        <link rel="alternate" hrefLang="nl-BE" href={HREF.nl} />
        <link rel="alternate" hrefLang="x-default" href={HREF.fr} />
      </Head>

      <section className="bg-white py-10 px-1 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Découvrez notre carte
          </h1>
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
    </>
  );
}
