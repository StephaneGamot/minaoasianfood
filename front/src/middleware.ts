// middleware.ts
/* import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Middleware i18n
const intlMiddleware = createMiddleware({
  ...routing,
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  // Laisse next-intl gérer locales/redirects
  const res = intlMiddleware(request) as NextResponse;

  // Nonce par requête (Edge runtime → Web Crypto dispos)
  const nonce = crypto.randomUUID();

  // Passe le nonce au layout via un header interne
  res.headers.set("x-nonce", nonce);

  // CSP stricte (autorise nos scripts noncés + Stripe Checkout en <iframe>)
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://js.stripe.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com",
    "frame-ancestors 'self'",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export const config = {
  matcher: ["/", "/(fr|en|nl)/:path*"],
};
*/


// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware({
  ...routing,
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  const res = intlMiddleware(request) as NextResponse;

  // Nonce par requête
  const nonce = crypto.randomUUID();
  res.headers.set("x-nonce", nonce);

  // Autoriser 'unsafe-eval' en DEV (Turbopack/Next en a besoin pour les source maps/Dev RSC)
  const isDev =
    process.env.NODE_ENV !== "production" ||
    request.headers.get("host")?.startsWith("localhost") ||
    request.headers.get("host")?.startsWith("127.0.0.1") ||
    request.headers.get("host")?.startsWith("192.168.");

  const scriptDirectives = [
    "'self'",
    `'nonce-${nonce}'`,
    "https://js.stripe.com",
    isDev ? "'unsafe-eval'" : null, // 👈 seulement en dev
  ]
    .filter(Boolean)
    .join(" ");

  const csp = [
    "default-src 'self'",
    `script-src ${scriptDirectives}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com",
    "frame-ancestors 'self'",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export const config = {
  matcher: ["/", "/(fr|en|nl)/:path*"],
};
