// src/lib/restaurants.ts

// --- Types ---
export type RestaurantId = "resto_a" | "resto_b";

export interface RestaurantConfig {
  id: RestaurantId;
  label: string;
  email: string;            // adresse du resto
  creditorName: string;     // intitulé bénéficiaire virement
  iban: string;
  bic?: string;
}

// --- Helpers env ---
// Trim + retire des guillemets éventuels collés dans Vercel ("valeur")
function env(key: string, fallback = ""): string {
  const raw = (process.env[key]?.trim() ?? fallback);
  return raw.replace(/^"(.*)"$/, "$1");
}

// --- Config restaurants (lit les ENV) ---
export const RESTAURANTS: Record<RestaurantId, RestaurantConfig> = {
  resto_a: {
    id: "resto_a",
    label: env("RESTAURANT_A_LABEL", "Minao Bruxelles"),
    email: env("RESTAURANT_A_EMAIL"),
    creditorName: env("RESTAURANT_A_CREDITOR_NAME", env("NEXT_PUBLIC_CREDITOR_NAME", "")),
    iban: env("RESTAURANT_A_IBAN", env("NEXT_PUBLIC_CREDITOR_IBAN", "")),
    bic: env("RESTAURANT_A_BIC", env("NEXT_PUBLIC_CREDITOR_BIC", "")),
  },
  resto_b: {
    id: "resto_b",
    label: env("RESTAURANT_B_LABEL", "Minao Dilbeek"),
    email: env("RESTAURANT_B_EMAIL"),
    creditorName: env("RESTAURANT_B_CREDITOR_NAME", env("NEXT_PUBLIC_CREDITOR_NAME", "")),
    iban: env("RESTAURANT_B_IBAN", env("NEXT_PUBLIC_CREDITOR_IBAN", "")),
    bic: env("RESTAURANT_B_BIC", env("NEXT_PUBLIC_CREDITOR_BIC", "")),
  },
};

// --- Utils exports ---
export function getRestaurantConfig(id?: string): RestaurantConfig {
  return id === "resto_b" ? RESTAURANTS.resto_b : RESTAURANTS.resto_a;
}

export function isRestaurantId(val: unknown): val is RestaurantId {
  return val === "resto_a" || val === "resto_b";
}

export function getFallbackRestaurantEmail(): string | null {
  const raw = process.env.RESTAURANT_EMAIL?.trim() ?? "";
  const clean = raw.replace(/^"(.*)"$/, "$1");
  return clean || null;
}

// Adresse “from” pour Resend
export function getEmailFrom(): string {
  const from = process.env.RESEND_FROM?.trim();
  if (from && from.length > 0) return from.replace(/^"(.*)"$/, "$1");

  const domain = process.env.RESEND_DOMAIN?.trim();
  if (domain && domain.length > 0) return `no-reply@${domain.replace(/^"(.*)"$/, "$1")}`;

  // fallback de secours pour tests
  return "onboarding@resend.dev";
}
