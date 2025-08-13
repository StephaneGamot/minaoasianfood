/*
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
  key: "Content-Security-Policy", 
  value: `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https://www.minaoasianfood.com/;
    font-src 'self';
    connect-src 'self'http://localhost:8080 https://vitals.vercel-insights.com https://www.google-analytics.com https://va.vercel-scripts.com;
    object-src 'none';
    base-uri 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim(),
}
,
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "require-corp",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://www.minaoasianfood.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/Images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "https://www.minaoasianfood.com/",
          },
        ],
        destination: "https://www.minaoasianfood.com/:1",
        permanent: true,
      },
     
    ];
  },
};

export default withNextIntl(nextConfig);
*/

// next.config.ts
import type { NextConfig, Header } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const isProd = process.env.NODE_ENV === "production";

/** CSP simple : en DEV on autorise le back local + ws HMR ; en PROD on reste strict */
const cspDev = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' http://localhost:8080 ws://localhost:3000 https://vitals.vercel-insights.com https://www.google-analytics.com https://va.vercel-scripts.com;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'self';
`.replace(/\s{2,}/g, " ").trim();

const cspProd = `
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://vitals.vercel-insights.com https://www.google-analytics.com https://va.vercel-scripts.com;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'self';
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders: Header[] = [
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
    : []),
  { key: "Content-Security-Policy", value: isProd ? cspProd : cspDev },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Les 3 CO* sont utiles en prod, mais peuvent gêner en dev
  ...(isProd
    ? [
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
      ]
    : []),
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.minaoasianfood.com", // <-- sans "https://"
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/_next/image",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/Images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },

  // Pas de redirects pour l’instant (ça générait ton erreur TS)
  // On pourra les remettre plus tard, typés proprement.
};

export default withNextIntl(nextConfig);
