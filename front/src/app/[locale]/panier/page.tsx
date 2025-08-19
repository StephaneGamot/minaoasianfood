// front/src/app/[locale]/panier/page.tsx
import React from "react";
import Head from "next/head";
import type { Metadata } from "next";
import ShoppingCart from "@/components/Shopping/ShoppingCart";

type Params = { locale: "fr" | "en" | "nl" };

// ── Metadata localisé (même pattern que /menu)
export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale } = await params;

  const TITLES = {
    fr: "Panier – Minao Asian Food à Bruxelles",
    en: "Cart – Minao Asian Food in Brussels",
    nl: "Winkelwagen – Minao Asian Food in Brussel",
  } as const;

  const DESCR = {
    fr: "Vérifiez votre panier et finalisez votre commande de cuisine asiatique halal à Bruxelles.",
    en: "Review your cart and complete your order of halal Asian cuisine in Brussels.",
    nl: "Bekijk je winkelwagen en rond je bestelling van halal Aziatische gerechten in Brussel af.",
  } as const;

  const OG_LOCALE = {
    fr: "fr_BE",
    en: "en_GB",
    nl: "nl_BE",
  } as const;

  const site = "https://www.minaoasianfood.com";
  const base = new URL(site);
  const path = `/${locale}/panier`;

  return {
    metadataBase: base,
    applicationName: "Minao Asian Food",
    title: TITLES[locale],
    description: DESCR[locale],
    alternates: {
      canonical: path,
      languages: {
        fr: "/fr/panier",
        en: "/en/panier",
        nl: "/nl/panier",
        "x-default": "/fr/panier",
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
          alt: "Panier Minao Asian Food",
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
      index: false, // ← panier: généralement noindex
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export default function PanierPage() {
  const HREF = {
    fr: "https://www.minaoasianfood.com/fr/panier",
    en: "https://www.minaoasianfood.com/en/panier",
    nl: "https://www.minaoasianfood.com/nl/panier",
  } as const;

  return (
    <>
      <Head>
        <link rel="alternate" hrefLang="fr-BE" href={HREF.fr} />
        <link rel="alternate" hrefLang="en-GB" href={HREF.en} />
        <link rel="alternate" hrefLang="nl-BE" href={HREF.nl} />
        <link rel="alternate" hrefLang="x-default" href={HREF.fr} />
      </Head>

      <ShoppingCart />
    </>
  );
}
