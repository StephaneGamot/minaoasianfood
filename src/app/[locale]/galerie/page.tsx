import Gallery from "@/components/Gallery/Gallery";
import img1 from "./../../../../public/images/menu/gyoza-scampi.webp";
import img2 from "./../../../../public/images/menu/yakitoris-poulet-halal.webp";
import img3 from "./../../../../public/images/menu/salade-vegetarien-thai.webp";
import img4 from "./../../../../public/images/menu/nouilles-sautees-mixte.webp";
import img5 from "./../../../../public/images/menu/riz-saute-vegetarien.webp";
import img6 from "./../../../../public/images/menu/pad-thai-vegetarien.webp";
import img7 from "./../../../../public/images/menu/curry-rouge-poulet.webp";
import img8 from "./../../../../public/images/menu/bao-vegetarien-falafel.webp";
import img9 from "./../../../../public/images/menu/salade-scampi-thai.webp";
import img10 from "./../../../../public/images/menu/nouilles-sautees-poulet.webp";
import img11 from "./../../../../public/images/menu/riz-saute-poulet.webp";
import img12 from "./../../../../public/images/menu/pad-thai-boeuf-poulet.webp";
import img13 from "./../../../../public/images/menu/curry-rouge-boeuf.webp";
import img14 from "./../../../../public/images/menu/bao-poulet-fume.webp";
import img15 from "./../../../../public/images/menu/karaage.webp";
import img16 from "./../../../../public/images/menu/nouilles-sautees-proteine.webp";
import img17 from "./../../../../public/images/menu/pad-thai-au-bœuf-delicieux.webp";
import img18 from "./../../../../public/images/menu/bao-boeuf.webp";
import img19 from "./../../../../public/images/menu/tempura-scampi.webp";
import img20 from "./../../../../public/images/menu/nouilles-sautees-scampis.webp";
import img21 from "./../../../../public/images/menu/riz-saute-mixte.webp";
import img22 from "./../../../../public/images/menu/pad-thai-scampis.webp";

import type { Metadata } from "next";

type GenerateMetadataProps = {
  params: { locale?: string };
};

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const locale = params.locale ?? "fr";
  const siteUrl = "https://www.minaoasianfood.com";

  return {
    title: {
      fr: "Gallerie Minao – Cuisine asiatique halal à Bruxelles",
      en: "Gallery Menu – Halal Asian Cuisine in Brussels",
      nl: "Gal Minao – Halal Aziatische Keuken in Brussel",
    }[locale],

    description: {
      fr: "Découvrez Minao : pad thaï, nouilles sautées, riz parfumé, desserts maison... Une cuisine asiatique savoureuse à Bruxelles.",
      en: "Explore Minao's pad Thai, stir-fried noodles, fragrant rice, homemade desserts... Tasty Asian cuisine in Brussels.",
      nl: "Ontdek het halal menu van Minao, geurige rijst, huisgemaakte desserts... Heerlijke Aziatische keuken in Brussel.",
    }[locale],

    alternates: {
      canonical: `${siteUrl}/${locale}/galerie`,
      languages: {
        fr: `${siteUrl}/fr/galerie`,
        en: `${siteUrl}/en/galerie`,
        nl: `${siteUrl}/nl/galerie`,
        "x-default": `${siteUrl}/fr/galerie`,
      },
    },
  };
}

export default function GalleryPage() {
  const images = [
    { src: img1, alt: "Salle du restaurant" },
    { src: img2, alt: "Tiramisu crémeux" },
    { src: img3, alt: "Bo bun" },
    { src: img4, alt: "Salle du restaurant" },
    { src: img5, alt: "Tiramisu crémeux" },
    { src: img6, alt: "Bo bun" },
    { src: img7, alt: "Salle du restaurant" },
    { src: img8, alt: "Tiramisu crémeux" },
    { src: img9, alt: "Bo bun" },
    { src: img10, alt: "Salle du restaurant" },
    { src: img11, alt: "Tiramisu crémeux" },
    { src: img12, alt: "Bo bun" },
    { src: img13, alt: "Salle du restaurant" },
    { src: img14, alt: "Tiramisu crémeux" },
    { src: img15, alt: "Bo bun" },
    { src: img16, alt: "Bo bun" },
    { src: img17, alt: "Salle du restaurant" },
    { src: img18, alt: "Tiramisu crémeux" },
    { src: img19, alt: "Bo bun" },
    { src: img20, alt: "Salle du restaurant" },
    { src: img21, alt: "Tiramisu crémeux" },
    { src: img22, alt: "Bo bun" },
  ];

  return (
    <main aria-labelledby="gallery-heading" className="p-4">
      <h1 className="text-3xl text-center font-bold text-gray-900 mb-4">
        Gallerie de Photos
      </h1>
      <Gallery images={images} />
    </main>
  );
}
