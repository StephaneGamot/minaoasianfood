import React from 'react'
import HomePageHero from '@/components/Heros/HomePageHero'
import WitchRestaurant from '@/components/WitchRestaurant/WitchRestaurant'
import MenuCategoriesSection from '../../components/Menu/MenuCategoriesSection'
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Massage relaxant à Halle - Bruxelles | La voie du bien-être",
	description: "Massage relaxant à Halle - Bruxelles. Découvrez nos soins personnalisés et retrouvez harmonie, bien-être et sérénité dans un cadre apaisant.",
	alternates: {
		canonical: "https://lavoiedubienetre.be/massage/relaxant",
	},
	openGraph: {
		title: "Massage relaxant à Halle - Bruxelles | La voie du bien-être",
		description: "Massage relaxant à Halle - Bruxelles. Découvrez nos soins personnalisés et retrouvez harmonie, bien-être et sérénité dans un cadre apaisant.",
		url: "https://lavoiedubienetre.be/massage/relaxant",
		type: "website",
		siteName: 'La voie du bien-être - massage relaxant',
    locale: 'fr_BE',
		images: [
			{
				url: "https://www.lavoiedubienetre.be/Images/hero/massage-tao-a-domicile-massotherapeuthe-halle-bruxelles-brabant-wallon.webp",
				width: 1200,
				height: 627,
				alt: "Une longue séance de massage lui permetant de tout oublier",
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
    <main className='bg-stone-100'>


      <HomePageHero />
      <WitchRestaurant />
      <MenuCategoriesSection />

    </main>
  )
}
