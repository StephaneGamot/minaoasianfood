import React from 'react'
import HomePageHero from '@/components/Heros/HomePageHero'
import WitchRestaurant from '@/components/WitchRestaurant/WitchRestaurant'
import MenuCategoriesSection from '../../components/Menu/MenuCategoriesSection'
import type { Metadata } from "next";
import Head from 'next/head';


export const metadata: Metadata = {
	title: "Minao Asian Food – Restaurant asiatique halal à Bruxelles",
	description: "Savourez une cuisine asiatique halal authentique à Bruxelles. Plats thaï, nouilles, riz sautés et desserts maison dans un cadre chaleureux.",
	alternates: {
		canonical: "https://www.minaoasianfood.com/fr",
	},
	openGraph: {
		title: "Minao Asian Food – Restaurant asiatique halal à Bruxelles",
		description: "Savourez une cuisine asiatique halal authentique à Bruxelles. Plats thaï, nouilles, riz sautés et desserts maison dans un cadre chaleureux.",
		url: "https://www.minaoasianfood.com",
		type: "website",
		siteName: 'Minao Asian Food',
    locale: 'fr_BE',
		images: [
			{
				url: "https://www.minaoasianfood.com/fr/images/menu/nouilles-sautees-boeuf.webp",
				width: 500,
				height: 500,
				alt: "cuisine asiatique halal authentique à Bruxelles",
			},
		],
	},
};




/*
type GenerateMetadataProps = {
  params: { locale?: string };
};


export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const currentLocale = locale ?? "fr";
  const siteUrl = "https://www.minaoasianfood.com";

  return {
    title: {
      fr: "Minao Asian Food – Restaurant asiatique halal à Bruxelles",
      en: "Minao Asian Food – Halal Asian Restaurant in Brussels",
      nl: "Minao Asian Food – Halal Aziatisch Restaurant in Brussel",
    }[currentLocale],

    description: {
      fr: "Savourez une cuisine asiatique halal authentique à Bruxelles. Plats thaï, nouilles, riz sautés et desserts maison dans un cadre chaleureux.",
      en: "Enjoy authentic halal Asian cuisine in Brussels. Thai dishes, noodles, fried rice and homemade desserts in a warm and cozy setting.",
      nl: "Geniet van authentieke halal Aziatische gerechten in Brussel. Thaise gerechten, noedels, gebakken rijst en huisgemaakte desserts in een warme sfeer.",
    }[currentLocale],

    alternates: {
      canonical: `${siteUrl}/${currentLocale}`,
      languages: {
        fr: `${siteUrl}/fr`,
        en: `${siteUrl}/en`,
        nl: `${siteUrl}/nl`,
        "x-default": `${siteUrl}/fr`,
      },
    },

    openGraph: {
      title: {
        fr: "Minao Asian Food – Restaurant asiatique halal à Bruxelles",
        en: "Minao Asian Food – Halal Asian Restaurant in Brussels",
        nl: "Minao Asian Food – Halal Aziatisch Restaurant in Brussel",
      }[currentLocale],
      description: {
        fr: "Pad thaï, riz sauté, nouilles wok, desserts gourmands... Découvrez Minao, votre adresse halal asiatique incontournable à Bruxelles.",
        en: "Pad Thai, stir-fried rice, wok noodles, delicious desserts... Discover Minao, your go-to halal Asian spot in Brussels.",
        nl: "Pad Thai, gebakken rijst, woknoedels, heerlijke desserts... Ontdek Minao, uw favoriete halal Aziatische adres in Brussel.",
      }[currentLocale],
      url: `${siteUrl}/${currentLocale}`,
      siteName: "Minao Asian Food",
      locale: `${currentLocale}_BE`,
      type: "website",
      images: [
        {
          url: `${siteUrl}/Images/OpenGraph/minao-restaurant.webp`,
          secureUrl: `${siteUrl}/Images/OpenGraph/minao-restaurant.webp`,
          width: 1200,
          height: 627,
          alt: {
            fr: "Table avec plats asiatiques halal servis au restaurant Minao",
            en: "Table with halal Asian dishes served at Minao restaurant",
            nl: "Tafel met halal Aziatische gerechten geserveerd in restaurant Minao",
          }[currentLocale],
          type: "image/webp",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@minaobrussels",
      title: {
        fr: "Minao Asian Food – Restaurant asiatique halal à Bruxelles",
        en: "Minao Asian Food – Halal Asian Restaurant in Brussels",
        nl: "Minao Asian Food – Halal Aziatisch Restaurant in Brussel",
      }[currentLocale],
      description: {
        fr: "Pad thaï, riz sauté, nouilles wok, desserts gourmands... Découvrez Minao, votre adresse halal asiatique incontournable à Bruxelles.",
        en: "Pad Thai, stir-fried rice, wok noodles, delicious desserts... Discover Minao, your go-to halal Asian spot in Brussels.",
        nl: "Pad Thai, gebakken rijst, woknoedels, heerlijke desserts... Ontdek Minao, uw favoriete halal Aziatische adres in Brussel.",
      }[currentLocale],
      images: [`${siteUrl}/Images/OpenGraph/minao-restaurant.webp`],
    },
  };
}

*/

export default function Homepage() {
  return (
    <div>
 <head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes" />
  <meta name="robots" content="index, follow" />
  <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="theme-color" content="#556B2F" />

  <title>Minao Asian Food – Restaurant asiatique halal à Bruxelles</title>
  <meta name="description" content="Savourez une cuisine asiatique halal authentique à Bruxelles. Plats thaï, nouilles, riz sautés et desserts maison dans un cadre chaleureux." />

  {/* Canonical */}
  <link rel="canonical" href="https://www.minaoasianfood.com/fr" />

  {/* Multilingual hreflang */}
  <link rel="alternate" hrefLang="fr" href="https://www.minaoasianfood.com/fr" />
  <link rel="alternate" hrefLang="en" href="https://www.minaoasianfood.com/en" />
  <link rel="alternate" hrefLang="nl" href="https://www.minaoasianfood.com/nl" />
  <link rel="alternate" hrefLang="x-default" href="https://www.minaoasianfood.com/fr" />

  {/* Favicon */}
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

  {/* Open Graph */}
  <meta property="og:title" content="Minao Asian Food – Restaurant asiatique halal à Bruxelles" />
  <meta property="og:description" content="Savourez une cuisine asiatique halal authentique à Bruxelles. Plats thaï, nouilles, riz sautés et desserts maison dans un cadre chaleureux." />
  <meta property="og:url" content="https://www.minaoasianfood.com" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Minao Asian Food" />
  <meta property="og:locale" content="fr_BE" />
  <meta property="og:image" content="https://www.minaoasianfood.com/fr/images/menu/nouilles-sautees-boeuf.webp" />
  <meta property="og:image:alt" content="cuisine asiatique halal authentique à Bruxelles" />
  <meta property="og:image:width" content="500" />
  <meta property="og:image:height" content="500" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@minaobrussels" />
  <meta name="twitter:title" content="Minao Asian Food – Restaurant asiatique halal à Bruxelles" />
  <meta name="twitter:description" content="Savourez une cuisine asiatique halal authentique à Bruxelles. Plats thaï, nouilles, riz sautés et desserts maison dans un cadre chaleureux." />
  <meta name="twitter:image" content="https://www.minaoasianfood.com/fr/images/menu/nouilles-sautees-boeuf.webp" />
</head>


    <main className='bg-stone-100'>


      <HomePageHero />
      <WitchRestaurant />
      <MenuCategoriesSection />

    </main>
    </div>
  )
}
