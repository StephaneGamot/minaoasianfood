'use client'
import Image from 'next/image';
import ImgBGHero from "./../../../public/images/foods.webp"

import { useTranslations } from 'next-intl';

export default function HomePageHero() {
  const t = useTranslations('homePageHero');

  return (
     <section className="relative overflow-hidden !bg-[545454]">
      {/* Image de fond */}
  

  

      {/* Contenu */}
      <div className="relative text-center px-4 py-16 max-w-3xl mx-auto">
        <h1 className="!text-[#545454] text-3xl md:text-4xl font-bold  mb-4">
          {t('title')}
        </h1>

        <p className="  text-lg md:text-xl !text-[#545454]">
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
