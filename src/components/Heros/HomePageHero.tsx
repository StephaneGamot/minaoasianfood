'use client';

import { useTranslations } from 'next-intl';

export default function HomePageHero() {
  const t = useTranslations('homePageHero');

  return (
    <section className="text-center px-4 py-10 max-w-3xl mx-auto bg-stone-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
      <p className="text-lg text-gray-700">
        {t.rich('description', {
          strong: (chunks) => <strong>{chunks}</strong>,
          span: (chunks) => <span className="text-red-700 font-semibold">{chunks}</span>,
          br: () => <br />
        })}
      </p>
    </section>
  );
}
