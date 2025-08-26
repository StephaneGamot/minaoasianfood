// src/lib/restaurants.ts
export type RestaurantId = "resto_a" | "resto_b";

export type RestaurantConfig = {
  id: RestaurantId;
  label: string;
  email: string | null;    // où envoyer l’email (Resend)
  creditorName: string;    // intitulé compte bancaire
  iban: string;
  bic?: string;
};

function env(name: string, fallback = "") {
  const v = process.env[name];
  return (typeof v === "string" ? v : fallback).trim();
}

// ⚙️ Renseigne tes .env :
// RESTAURANT_A_LABEL, RESTAURANT_A_EMAIL, RESTAURANT_A_CREDITOR_NAME, RESTAURANT_A_IBAN, RESTAURANT_A_BIC
// RESTAURANT_B_LABEL, RESTAURANT_B_EMAIL, RESTAURANT_B_CREDITOR_NAME, RESTAURANT_B_IBAN, RESTAURANT_B_BIC
// (optionnel) RESTAURANT_EMAIL → fallback global si A/B manquent
export const RESTAURANTS: Record<RestaurantId, RestaurantConfig> = {
  resto_a: {
    id: "resto_a",
    label: env("RESTAURANT_A_LABEL", "Minao Bruxelles"),
    email: env("RESTAURANT_A_EMAIL") || env("RESTAURANT_EMAIL") || null,
    creditorName: env("RESTAURANT_A_CREDITOR_NAME", "Minao Bruxelles"),
    iban: env("RESTAURANT_A_IBAN"),
    bic: env("RESTAURANT_A_BIC"),
  },
  resto_b: {
    id: "resto_b",
    label: env("RESTAURANT_B_LABEL", "Minao Dilbeek"),
    email: env("RESTAURANT_B_EMAIL") || env("RESTAURANT_EMAIL") || null,
    creditorName: env("RESTAURANT_B_CREDITOR_NAME", "Minao Dilbeek"),
    iban: env("RESTAURANT_B_IBAN"),
    bic: env("RESTAURANT_B_BIC"),
  },
} as const;

export function isRestaurantId(v: unknown): v is RestaurantId {
  return v === "resto_a" || v === "resto_b";
}

export function getRestaurantConfig(id?: unknown): RestaurantConfig {
  return isRestaurantId(id) ? RESTAURANTS[id] : RESTAURANTS.resto_a;
}

// ✅ manquante dans ton import
export function getFallbackRestaurantEmail(): string | null {
  const v = env("RESTAURANT_EMAIL");
  return v || null;
}

// ✅ manquante dans ton import
// Idéalement configure RESEND_FROM = 'Minao <orders@mg.minaoasianfood.com>'
export function getEmailFrom(): string {
  const configured = env("RESEND_FROM");
  if (configured) return configured;

  const domain = env("RESEND_DOMAIN"); // ex: mg.minaoasianfood.com
  if (domain) return `orders@${domain}`;

  // fallback dev
  return "no-reply@localhost";
}

