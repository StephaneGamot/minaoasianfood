import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Galerie – Minao Asian Food à Bruxelles",
  description:
    "Explorez notre galerie de plats asiatiques halal faits maison. Découvrez l’univers visuel de Minao à travers nos spécialités.",
  alternates: {
    // ✅ chemin relatif ; Next l’absolutise avec `metadataBase`
    canonical: "/fr/galerie",
    // ✅ hreflang
    languages: {
      fr: "/fr/galerie",
      en: "/en/galerie",
      nl: "/nl/galerie",
      "x-default": "/fr/galerie"
    }
  },
  openGraph: {
    title: "Galerie – Minao Asian Food à Bruxelles",
    description:
      "Photos authentiques de notre cuisine asiatique halal et de nos plats signatures à emporter ou sur place.",
    url: "/fr/galerie",
    type: "website",
    siteName: "Minao Asian Food",
    locale: "fr_BE",
    images: [
      {
        url: "/fr/images/gallery/gallery-preview.webp",
        width: 1200,
        height: 630,
        alt: "Galerie photo du restaurant et des plats Minao"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Galerie – Minao Asian Food à Bruxelles",
    description:
      "Photos authentiques de notre cuisine asiatique halal et de nos plats signatures à emporter ou sur place.",
    images: ["/fr/images/gallery/gallery-preview.webp"],
    site: "@minaobrussels"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    }
  }
};


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
        Galerie de Photos
      </h1>
      <Gallery images={images} />
    </main>
  );
}
