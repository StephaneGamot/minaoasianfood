'use client'
import Image from 'next/image';
import ImgBGHero from "./../../../public/images/foods.webp"

import { useTranslations } from 'next-intl';

export default function HomePageHero() {
  const t = useTranslations('homePageHero');

  return (
     <section className="relative overflow-hidden">
      {/* Image de fond */}
      <Image
        src={ImgBGHero}
        alt={'Delicious asian food'}
        fill
        priority
        className="object-cover"
      />

      {/* Filtre / overlay pour le contraste */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Contenu */}
      <div className="relative text-center px-4 py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('title')}
        </h1>

        <p className="text-lg md:text-xl text-gray-100">
          {t.rich('description', {
            strong: (chunks) => <strong className="font-semibold">{chunks}</strong>,
            span: (chunks) => (
              <span className="text-[#f47457] font-semibold">
                {chunks}
              </span>
            ),
            br: () => <br />,
          })}
        </p>
      </div>
    </section>
  );
}
