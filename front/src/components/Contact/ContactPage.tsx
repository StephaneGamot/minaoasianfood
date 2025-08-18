"use client";

import Image from "next/image";
import restaurants from "./restaurants.json";
import { useTranslations, useLocale } from "next-intl";

type Locale = "fr" | "en" | "nl";

type Restaurant = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  photos: string[];
  hours: Record<Locale, string>;
};

export default function ContactPageClient() {
  const t = useTranslations("contact");        // ✅ comme dans le Footer
  const locale = useLocale() as Locale;        // ✅ récupère la langue active
  const data = restaurants as Restaurant[];

  return (
    <div className="mt-10 space-y-12">
      {data.map((loc) => (
        <section
          key={loc.id}
          className="grid gap-8 md:grid-cols-2"
          aria-labelledby={`loc-${loc.id}-title`}
        >
        <div className="grid gap-4">
  {loc.photos.slice(0, 1).map((src, i) => (
    <div
      key={`${loc.id}-photo-${i}`}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <Image
        src={src}
        alt={loc.name}
        width={1200}
        height={800}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="h-full w-full object-cover"
        priority
      />
    </div>
  ))}
</div>

          {/* Coordonnées */}
          <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 id={`loc-${loc.id}-title`} className="text-lg font-semibold text-gray-900">
              {loc.name}
            </h2>
            <ul className="mt-4 space-y-3 text-gray-700">
              <li>
                <span className="block text-sm font-medium text-gray-900">
                  {t("labels.address")}
                </span>
                <span>{loc.address}</span>
              </li>
              <li>
                <span className="block text-sm font-medium text-gray-900">
                  {t("labels.phone")}
                </span>
                <a
                  className="text-red-800 hover:underline"
                  href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                >
                  {loc.phone}
                </a>
              </li>
              <li>
                <span className="block text-sm font-medium text-gray-900">
                  {t("labels.email")}
                </span>
                <a className="text-red-800 hover:underline" href={`mailto:${loc.email}`}>
                  {loc.email}
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center text-red-800 hover:underline"
                  href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("labels.map")}
                </a>
              </li>
            </ul>

            <div className="mt-6">
             <h3 className="text-sm font-medium text-gray-900">{t("labels.hours")}</h3>
<p className="mt-2 text-gray-700 whitespace-pre-line">{loc.hours[locale]}</p>

            </div>
          </aside>
        </section>
      ))}
    </div>
  );
}
