"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Image, { StaticImageData } from "next/image";
import { useTranslations, useLocale } from 'next-intl';

import Entrees from "./../../../public/images/menu/entrees.jpg"
import Riz     from "./../../../public/images/menu/riz.jpg"
import Bao from "./../../../public/images/menu/bao.webp"
import Nouilles from "./../../../public/images/menu/nouilles.jpg"
import PadThai from "./../../../public/images/menu/pad-thai.jpg"
import Desserts from "./../../../public/images/menu/desserts.jpg"
import Boissons from "./../../../public/images/menu/boissons.jpg"
import PlatsSauce from "./../../../public/images/menu/plats-sauce.jpg"
// import Incontournables from "./../../../public/images/menu/incontournables.jpg"
// import Nouveautes from "./../../../public/images/menu/nouveautes.jpg"

// mapping index <-> image
const images: Record<number, StaticImageData> = {
  0: Entrees,
  1: Bao,
  2: PlatsSauce,
  3: Riz,
  4: Nouilles,
  5: PadThai,
  6: Desserts,
  7: Boissons,
};

// 🪄 Wrapper pour l'animation au scroll
function AnimatedCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);   // on est dans le viewport → déclenche anim
        } else {
          setIsInView(false);  // on sort du viewport → on remet à zéro
        }
      },
      { threshold: 0.3 } // ~30% visible avant déclenchement
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transform transition-transform duration-700 ease-out ${
        isInView ? "delay-500 -translate-y-2" : "translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}


export default function MenuCategoriesSection() {
  const t = useTranslations("menuCategoriesSection");
  const locale = useLocale();

  const categories = t.raw("categories") as {
    id: string;
    name: string;
    description: string;
    alt: string;
  }[];

  return (
    <section className="bg-stone-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
          {t("title")}
        </h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <AnimatedCard key={cat.id}>
              <Link
                href={`/${locale}/menu#${cat.id}`}
                className="group block rounded-xl overflow-hidden shadow hover:shadow-xl transition"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl">
                  <Image
                    src={images[index as keyof typeof images]}
                    alt={cat.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="bg-white p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {cat.description}
                  </p>
                </div>
              </Link>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}