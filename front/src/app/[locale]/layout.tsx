import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { headers } from "next/headers";
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


type Locale = "fr" | "en" | "nl";
type Params = { locale: Locale };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
//  const { locale } = await params;

  // ✅ Ne JAMAIS retomber sur localhost en prod
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") // ex: https://www.minaoasianfood.com
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.minaoasianfood.com");

  const base = new URL(site);

  return {
    metadataBase: base,
    applicationName: "Minao Asian Food",
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
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      ],
    },
  };
}



type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // ✅ params est un Promise en app router
};

const HTML_LANG = { fr: "fr-BE", en: "en-GB", nl: "nl-BE" } as const;

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  const safeLocale: Locale = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;

  setRequestLocale(safeLocale);

  // Charge les messages i18n
  const messages = {} as AbstractIntlMessages;
  for (const ns of [
    "nav",
    "footer",
    "homePageHero",
    "witchRestaurant",
    "menuCategoriesSection",
    "registerForm",
    "loginForm",
    "profile",
    "contact",
    "gallery",
  ] as const) {
    messages[ns] = (await import(`../../messages/${safeLocale}/${ns}.json`))
      .default as AbstractIntlMessages;
  }

  // ✅ headers() est async sur ta version → il faut await
  const hdrs = await headers();
  const nonce = hdrs.get("x-nonce") ?? undefined;

  return (
        <html lang={HTML_LANG[safeLocale]}>
      <body className="bg-light text-dark">
        {/* Skip link a11y */}
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

        {/* JSON-LD autorisé par la CSP via nonce */}
        <Script
          id="minao-restaurant-ld"
          nonce={nonce}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "Minao Asian Food",
              servesCuisine: "Asian",
              priceRange: "€€",
              url:
                (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") +
                `/${safeLocale}`,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bruxelles",
                addressCountry: "BE",
              },
            }),
          }}
        />
      </body>

    </html>
  );
}
