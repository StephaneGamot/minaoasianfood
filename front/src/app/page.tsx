// src/app/page.tsx
import { redirect } from 'next/navigation';
import { headers as getHeaders } from 'next/headers';
import Negotiator from 'negotiator';

const SUPPORTED_LOCALES = ['fr', 'en', 'nl'];
const DEFAULT_LOCALE = 'fr';

export async function generateMetadata() {
  return {
    title: "Redirection...",
    description: "Redirection automatique vers votre langue préférée.",
    alternates: {
      canonical: "https://www.minaoasianfood.com/",
      languages: {
        fr: "https://www.minaoasianfood.com/fr",
        en: "https://www.minaoasianfood.com/en",
        nl: "https://www.minaoasianfood.com/nl",
      },
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function Page() { 
  const headers = await getHeaders(); 
  const acceptLang = headers.get('accept-language') || '';
  const langs = new Negotiator({ headers: { 'accept-language': acceptLang } }).languages();
  const locale = langs.find((l) => SUPPORTED_LOCALES.includes(l.split('-')[0])) || DEFAULT_LOCALE;

  redirect(`/${locale}`);
}
