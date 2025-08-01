'use client';

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { StaticImageData } from 'next/image';


import restaurant1 from "./../../../public/images/restaurant1.jpg";
import restaurant2 from "./../../../public/images/restaurant2.jpg";

const images: Record<number, StaticImageData> = {
  1: restaurant1,
  2: restaurant2,
};


export default function WitchRestaurant() {
  const t = useTranslations("witchRestaurant");

  return (
    <section className="bg-white py-16 px-4 lg:px-12">
      <div className="mx-auto max-w-7xl text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">{t("title")}</h2>
        <p className="mt-2 text-gray-600">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto place-items-center">
        {[1, 2].map((id) => (
          <div
            key={id}
            className="overflow-hidden rounded-xl shadow-lg transition hover:shadow-xl max-w-[500px] w-full"
          >
            <div className="relative w-full aspect-[3/2]">
              <Image
    src={images[id]}
    alt={t(`restaurants.${id}.name`)}
    loading="lazy"
    fill
    sizes="(max-width: 768px) 100vw, 33vw"
    className="object-cover"
  />
              <span className="absolute top-3 left-3 bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                {t(`restaurants.${id}.badge`)}
              </span>
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-xl font-bold text-gray-900">{t(`restaurants.${id}.name`)}</h3>
              <p className="mt-1 text-sm text-gray-600">{t(`restaurants.${id}.address`)}</p>
              <p className="text-sm text-gray-600">{t(`restaurants.${id}.hours`)}</p>
              <p className="text-sm text-gray-600 mt-1">📞 {t(`restaurants.${id}.phone`)}</p>
              <div className="mt-4">
                <Link
                  href={
                    id === 1
                      ? "https://goo.gl/maps/example1"
                      : "https://goo.gl/maps/example2"
                  }
                  target="_blank"
                  className="inline-block text-red-800 font-medium hover:underline"
                >
                  {t("map")}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
