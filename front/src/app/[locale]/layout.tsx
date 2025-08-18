import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { hasLocale, type AbstractIntlMessages } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header/NavBar";
import Footer from "@/components/Footer/Footer";
import "./../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Locale = "fr" | "en" | "nl";
type Params = { locale: Locale };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
};

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale } = await params; // ✅ on attend params
  const base = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

  return {
    metadataBase: base,
    applicationName: "Minao Asian Food",
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", en: "/en", nl: "/nl", "x-default": "/" },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/front/src/app/favicon.ico", sizes: "any" },
      ],
    },
  };
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  // ✅ ICI AUSSI: params est un Promise
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params; // ✅ ne pas accéder à params sans await

  const safeLocale: Locale = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;

  setRequestLocale(safeLocale);

  const messages = {} as AbstractIntlMessages;
  for (const ns of [
    "nav","footer","homePageHero","witchRestaurant",
    "menuCategoriesSection","registerForm","loginForm","profile"
  ] as const) {
    messages[ns] = (await import(`../../messages/${safeLocale}/${ns}.json`)).default as AbstractIntlMessages;
  }

  return (
    <html lang={safeLocale}>

      <body className="bg-light text-dark">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-white focus:text-black focus:p-2 focus:rounded focus:shadow"
        >
          Aller au contenu principal
        </a>

        <Providers locale={safeLocale} messages={messages}>
          <Header />
          {children}
          <Footer />
        </Providers>

        <Script
          id="minao-restaurant-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "Minao Asian Food",
              servesCuisine: "Asian",
              priceRange: "€€",
              url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") + `/${safeLocale}`,
              address: { "@type": "PostalAddress", addressLocality: "Bruxelles", addressCountry: "BE" },
            }),
          }}
        />
      </body>
    </html>
  );
}
