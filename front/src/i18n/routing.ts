import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
locales: ["fr", "en", "nl"] as const,
  defaultLocale: "fr",
  localePrefix: "always" as const
  
});
