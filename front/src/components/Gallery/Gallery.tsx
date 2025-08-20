"use client"

import Image, { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

interface GalleryProps {
  title?: string;
  images: {
    src: string | StaticImageData;
    alt: string;
  }[];
}

export default function Gallery({ images }: GalleryProps) {
    const t = useTranslations("gallery");

  return (
        <main aria-labelledby="gallery-heading" className="p-4">
      <h1 id="gallery-heading" className="text-3xl text-center font-bold text-gray-900 mb-4">
        {t("title")}
      </h1>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {images.map((image, index) => (
        <div key={index} className="relative w-full aspect-square overflow-hidden rounded-xl shadow-sm">
          <Image
            src={image.src}
            alt={image.alt}
            layout="fill"
            objectFit="cover"
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
    </main>
  );
}
