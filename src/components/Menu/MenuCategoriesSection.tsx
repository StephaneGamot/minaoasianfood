"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

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
const images = {
  0: Entrees,
  1: Bao,
  2: PlatsSauce,
  3: Riz,
  4: Nouilles,
  5: PadThai,
  6: Desserts,
  7: Boissons,
};

export default function MenuCategoriesSection() {
  const t = useTranslations('menuCategoriesSection');
  const categories = t.raw('categories') as {
    name: string;
    description: string;
    alt: string;
  }[];

  return (
    <section className="bg-stone-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
          {t('title')}
        </h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <Link
              key={index}
              href={`/menu/${cat.name.toLowerCase().replace(/ /g, "-")}`}
              className="group block rounded-xl overflow-hidden shadow hover:shadow-xl transition"
            >
              <div className="aspect-[3/2] relative overflow-hidden">
                <Image
                  src={images[index as keyof typeof images]}
                  alt={cat.alt}
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="bg-white p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
