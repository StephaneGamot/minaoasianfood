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

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale ?? "fr";
  const siteUrl = "https://www.creation-site-internet.dev";

  return {
    title: {
      fr: "Création de site internet élégant & SEO – Stéphane Gamot",
      en: "Elegant & SEO-Optimized Website Creation – Stéphane Gamot",
      nl: "Elegante & SEO-geoptimaliseerde websitecreatie – Stéphane Gamot",
    }[locale],

    description: {
      fr: "Développeur web & expert SEO, je crée des sites modernes, performants et optimisés pour Google. Création sur-mesure, responsive et orientée conversion.",
      en: "Web developer & SEO expert crafting modern, high-performance websites optimized for Google. Offering bespoke, responsive designs that drive conversions.",
      nl: "Webontwikkelaar & SEO-expert, ik maak moderne, snelle websites geoptimaliseerd voor Google. Maatwerk, responsive en conversiegericht.",
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
        fr: "Création de site internet élégant & SEO – Stéphane Gamot",
        en: "Elegant & SEO-Optimized Website Creation – Stéphane Gamot",
        nl: "Elegante & SEO-geoptimaliseerde websitecreatie – Stéphane Gamot",
      }[locale],
      description: {
        fr: "Un site pensé pour votre image, votre audience et votre référencement. Ensemble, créons votre vitrine digitale idéale.",
        en: "A website designed around your brand, your audience, and your online visibility. Together, let’s create your ideal digital showcase.",
        nl: "Een site ontworpen voor uw imago, uw doelgroep en uw online vindbaarheid. Laten we samen uw ideale digitale etalage creëren.",
      }[locale],
      url: `${siteUrl}/${locale}/menu`,
      siteName: "Création Site Internet",
      locale: `${locale}_BE`,
      type: "website",
      images: [
        {
          url: `${siteUrl}/Images/OpenGraph/webDevAtWork.webp`,
          secureUrl: `${siteUrl}/Images/OpenGraph/webDevAtWork.webp`,
          width: 1200,
          height: 627,
          alt: {
            fr: "Site web fluide et responsive affiché sur écran",
            en: "A sleek, responsive website displayed on a screen",
            nl: "Een flexibele, responsieve website weergegeven op een scherm",
          }[locale],
          type: "image/webp",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@stephanegamot",
      title: {
        fr: "Création de site internet élégant & SEO – Stéphane Gamot",
        en: "Elegant & SEO-Optimized Website Creation – Stéphane Gamot",
        nl: "Elegante & SEO-geoptimaliseerde websitecreatie – Stéphane Gamot",
      }[locale],
      description: {
        fr: "Un site pensé pour votre image, votre audience et votre référencement. Ensemble, créons votre vitrine digitale idéale.",
        en: "A website designed around your brand, your audience, and your online visibility. Together, let’s create your ideal digital showcase.",
        nl: "Een site ontworpen voor uw imago, uw doelgroep en uw online vindbaarheid. Laten we samen uw ideale digitale etalage creëren.",
      }[locale],
      images: [`${siteUrl}/Images/OpenGraph/webDevAtWork.webp`],
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
