// src/components/Gallery/Gallery.tsx
import Image, { StaticImageData } from "next/image";

interface GalleryProps {
  title?: string;
  images: {
    src: string | StaticImageData;
    alt: string;
  }[];
}

export default function Gallery({ images }: GalleryProps) {
  return (
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
  );
}
