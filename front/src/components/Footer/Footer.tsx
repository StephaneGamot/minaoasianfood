"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import LangSwitcher from "../LangSwitcher/LangSwitcher";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  const base = `/${locale}`;

  const navigation = {
    main: [
      { name: "Accueil", href: `${base}` },
      { name: "Menu", href: `${base}/menu` },
      { name: "Galerie", href: `${base}/galerie` },
      { name: "Contact", href: `${base}/contact` },
    ],
    social: [
      {
        name: "Facebook",
        href: "#",
        icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: "Instagram",
        href: "#",
        icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: "X",
        href: "#",
        icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
          </svg>
        ),
      },
    ],
  };

  return (
    <footer className="bg-zinc-900 text-zinc-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* NAVIGATION */}
        <nav className="mb-10 flex justify-center gap-x-8 text-sm font-medium">
          <Link href={`/${locale}/`} className="hover:text-white">
            {t("nav.home")}
          </Link>
          <Link href={`/${locale}/menu`} className="hover:text-white">
            {t("nav.menu")}
          </Link>
          <Link href={`/${locale}/galerie`} className="hover:text-white">
            {t("nav.gallery")}
          </Link>
          <Link href={`/${locale}/contact`} className="hover:text-white">
            {t("nav.contact")}
          </Link>
          {/*<Link href="/faq" className="hover:text-white">{t("nav.faq")}</Link>*/}
        </nav>

        {/* GRID COLONNES CENTRÉES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-center md:text-left max-w-5xl mx-auto">
          {/* Horaires */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              {t("hours.title")}
            </h3>
            <ul className="space-y-1">
              <li>{t("hours.monday")}</li>
              <li>{t("hours.tuesday")}</li>
              <li>{t("hours.wednesday")}</li>
              <li>{t("hours.thursday")}</li>
              <li>{t("hours.friday")}</li>
              <li>{t("hours.saturday")}</li>
              <li>{t("hours.sunday")}</li>
            </ul>
          </div>

          {/* Particularités */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              {t("features.title")}
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-center md:justify-start gap-2">
                🛵 {t("features.delivery")}
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                💳 {t("features.cards")}
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                🥡 {t("features.takeaway")}
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                📅 {t("features.booking")}
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                🍽️ {t("features.onsite")}
              </li>
            </ul>
          </div>

          {/* Contact & Adresse */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              {t("contact.title")}
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <a href="tel:+32499123456" className="hover:underline">
                  📞 +32 499 12 34 56
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <a
                  href="mailto:contact@minaoasianfood.com"
                  className="hover:underline"
                >
                  📧 contact@minaoasianfood.com
                </a>
              </li>
            </ul>
            <h3 className="text-white font-semibold mt-5 mb-2">
              {t("address.title")}
            </h3>
            <address className="not-italic leading-6">
              🚉 {t("address.station")}
              <br />
              📍 {t("address.street")}
              <br />
              {t("address.city")}
            </address>
          </div>
        </div>

        {/* RÉSEAUX + LANGSWITCHER */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-around gap-6 text-sm text-gray-300 max-w-5xl mx-auto">
          <div className="flex gap-5">
            {navigation.social.map((item) => (
              <a key={item.name} href={item.href} className="hover:text-white">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <LangSwitcher />
        </div>

        {/* COPYRIGHT */}
        <p className="mt-6 text-center text-sm text-gray-400">
          &copy; 2025 Minao Asian Food. {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
