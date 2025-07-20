"use client";
import Image from "next/image";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

type ResponsiveImageProps = {
  src: string; // chemin vers l'image
  alt: string;
  size?: Size; // taille souhaitée
  rounded?: boolean; // coins arrondis ou non
  priority?: boolean; // pour le chargement
  className?: string; // classes tailwind optionnelles
};

const sizeMap: Record<Size, { width: number; height: number }> = {
  xs: { width: 64, height: 64 },
  sm: { width: 128, height: 128 },
  md: { width: 192, height: 192 },
  lg: { width: 256, height: 256 },
  xl: { width: 384, height: 384 },
};

export default function ResponsiveImage({
  src,
  alt,
  size = "md",
  rounded = true,
  priority = false,
  className = "",
}: ResponsiveImageProps) {
  const { width, height } = sizeMap[size];
  return (
    <div
      className={`relative ${rounded ? "rounded-xl overflow-hidden" : ""} ${className}`}
      style={{ width, height }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${width}px`}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
