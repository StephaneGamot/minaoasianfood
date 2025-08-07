// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing'; 

export default createMiddleware({
  ...routing,
  localePrefix: 'always' // ou 'as-needed' si c'est ce que tu veux
});

export const config = {
  matcher: ['/', '/(fr|en|nl)/:path*']
};
