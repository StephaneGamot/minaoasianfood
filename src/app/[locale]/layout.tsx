import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from "@/i18n/routing";
import { Cormorant_Garamond, Open_Sans } from 'next/font/google';
// import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/Header/NavBar';
import Footer from '@/components/Footer/Footer';
import './../globals.css';

// Polices Google
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-title',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
});

// Typage des paramètres de layout
type LocaleLayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

// Pour la génération des chemins statiques (i18n)
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Layout principal multilingue
export default async function LocaleLayout(props: LocaleLayoutProps) {
  const { children } = props;
  const params = await Promise.resolve(props.params); // ✅ forcer async context
  const { locale } = params;

  const safeLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  setRequestLocale(safeLocale);

  const messages = (await import(`@/messages/${safeLocale}.json`)).default;


  return (
    <html lang={safeLocale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes" />
        <meta name="theme-color" content="#556B2F" media="(prefers-color-scheme: dark)" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        <meta name="google-site-verification" content="" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className={`${cormorant.variable} ${openSans.variable} bg-light text-dark font-body`}>
        <NextIntlClientProvider locale={safeLocale} messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
