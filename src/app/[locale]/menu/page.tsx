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

type Props = {
  params: {
    locale: string;
  };
};

export function generateMetadata({ params }: Props): Metadata {
  const locale = params.locale ?? "fr";
  const siteUrl = "https://www.creation-site-internet.dev";

  return {
    title: {
      fr: "Carte Minao – Plats halal & asiatiques",
      en: "Minao Menu – Halal Asian Dishes",
      nl: "Minao Menu – Halal Aziatische Gerechten",
    }[locale],

    description: {
      fr: "Découvrez nos entrées, nouilles, pad thaï, riz sauté, bao et desserts halal préparés maison.",
      en: "Explore our starters, noodles, pad thai, fried rice, baos & desserts – all halal and homemade.",
      nl: "Ontdek onze starters, noedels, pad thai, gebakken rijst, baos & desserts – allemaal halal en huisgemaakt.",
    }[locale],

    alternates: {
      canonical: `${siteUrl}/${locale}/menu`,
      languages: {
        fr: `${siteUrl}/fr/menu`,
        en: `${siteUrl}/en/menu`,
        nl: `${siteUrl}/nl/menu`,
        "x-default": `${siteUrl}/fr/menu`,
      },
    },

    openGraph: {
      title: {
        fr: "Carte Minao – Plats halal & asiatiques",
        en: "Minao Menu – Halal Asian Dishes",
        nl: "Minao Menu – Halal Aziatische Gerechten",
      }[locale],
      description: {
        fr: "Sélection halal maison : nouilles, pad thaï, riz sauté, bao et desserts gourmands.",
        en: "House-made halal selection: noodles, pad thai, fried rice, baos, and decadent desserts.",
        nl: "Huisgemaakte halal selectie: noedels, pad thai, gebakken rijst, baos en decadente desserts.",
      }[locale],
      url: `${siteUrl}/${locale}/menu`,
      siteName: "Minao Asian Food",
      locale: `${locale}_BE`,
      type: "website",
      images: [
        {
          url: `${siteUrl}/Images/OpenGraph/minao-menu.webp`,
          width: 1200,
          height: 627,
          alt: {
            fr: "Carte de plats Minao préparés maison",
            en: "Minao menu dishes, homemade and halal",
            nl: "Minao menugerechten, huisgemaakt en halal",
          }[locale],
          type: "image/webp",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@minaobrussels",
      title: {
        fr: "Carte Minao – Plats halal & asiatiques",
        en: "Minao Menu – Halal Asian Dishes",
        nl: "Minao Menu – Halal Aziatische Gerechten",
      }[locale],
      description: {
        fr: "Nos plats maison halal : nouilles, pad thaï, riz, bao et desserts gourmands prêts à emporter.",
        en: "Our homemade halal dishes: noodles, pad thai, rice, baos & desserts ready to order.",
        nl: "Onze huisgemaakte halal gerechten: noedels, pad thai, rijst, baos & desserts klaar om te bestellen.",
      }[locale],
      images: [`${siteUrl}/Images/OpenGraph/minao-menu.webp`],
    },
  };
}




/*
type GenerateMetadataProps = {
  params: { locale?: string };
};

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const locale = params.locale ?? "fr";
  const siteUrl = "https://www.minaoasianfood.com";

  return {
    title: {
      fr: "Menu Minao – Cuisine asiatique halal à Bruxelles",
      en: "Minao Menu – Halal Asian Cuisine in Brussels",
      nl: "Menu Minao – Halal Aziatische Keuken in Brussel",
    }[locale],

    description: {
      fr: "Découvrez le menu halal de Minao : pad thaï, nouilles sautées, riz parfumé, desserts maison... Une cuisine asiatique savoureuse à Bruxelles.",
      en: "Explore Minao's halal menu: pad Thai, stir-fried noodles, fragrant rice, homemade desserts... Tasty Asian cuisine in Brussels.",
      nl: "Ontdek het halal menu van Minao: pad Thai, gebakken noedels, geurige rijst, huisgemaakte desserts... Heerlijke Aziatische keuken in Brussel.",
    }[locale],

    alternates: {
      canonical: `${siteUrl}/${locale}/menu`,
      languages: {
        fr: `${siteUrl}/fr/menu`,
        en: `${siteUrl}/en/menu`,
        nl: `${siteUrl}/nl/menu`,
        "x-default": `${siteUrl}/fr/menu`,
      },
    },

    openGraph: {
      title: {
        fr: "Menu Minao – Cuisine asiatique halal à Bruxelles",
        en: "Minao Menu – Halal Asian Cuisine in Brussels",
        nl: "Menu Minao – Halal Aziatische Keuken in Brussel",
      }[locale],
      description: {
        fr: "Pad thaï, nouilles, riz, plats sautés et desserts faits maison. Le menu Minao vous invite à un voyage culinaire halal en plein cœur de Bruxelles.",
        en: "Pad Thai, noodles, rice, stir-fried dishes and homemade desserts. Minao’s menu invites you to a halal culinary journey in Brussels.",
        nl: "Pad Thai, noedels, rijst, gewokte gerechten en huisgemaakte desserts. Het Minao-menu neemt je mee op een halal culinaire reis in Brussel.",
      }[locale],
      url: `${siteUrl}/${locale}/menu`,
      siteName: "Minao Asian Food",
      locale: `${locale}_BE`,
      type: "website",
      images: [
        {
          url: `${siteUrl}/Images/OpenGraph/minao-menu.webp`,
          secureUrl: `${siteUrl}/Images/OpenGraph/minao-menu.webp`,
          width: 1200,
          height: 627,
          alt: {
            fr: "Assortiment de plats du menu Minao, restaurant asiatique halal à Bruxelles",
            en: "Assorted dishes from Minao’s menu, halal Asian restaurant in Brussels",
            nl: "Gerechten uit het Minao-menu, halal Aziatisch restaurant in Brussel",
          }[locale],
          type: "image/webp",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@minaobrussels",
      title: {
        fr: "Menu Minao – Cuisine asiatique halal à Bruxelles",
        en: "Minao Menu – Halal Asian Cuisine in Brussels",
        nl: "Menu Minao – Halal Aziatische Keuken in Brussel",
      }[locale],
      description: {
        fr: "Pad thaï, nouilles, riz, plats sautés et desserts faits maison. Le menu Minao vous invite à un voyage culinaire halal en plein cœur de Bruxelles.",
        en: "Pad Thai, noodles, rice, stir-fried dishes and homemade desserts. Minao’s menu invites you to a halal culinary journey in Brussels.",
        nl: "Pad Thai, noedels, rijst, gewokte gerechten en huisgemaakte desserts. Het Minao-menu neemt je mee op een halal culinaire reis in Brussel.",
      }[locale],
      images: [`${siteUrl}/Images/OpenGraph/minao-menu.webp`],
    },
  };
}
*/

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
