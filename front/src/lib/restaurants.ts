// src/lib/restaurants.ts
export type RestaurantId = "resto_a" | "resto_b";

export type RestaurantConfig = {
  id: RestaurantId;
  label: string;
  email: string | null;
  creditorName: string | null;
  iban: string | null;
  bic: string | null;
};

// --- helpers env sûrs ---
function env(name: string): string | null {
  const v = process.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

// ✅ type guard demandé par ta page /pay
export function isRestaurantId(x: unknown): x is RestaurantId {
  return x === "resto_a" || x === "resto_b";
}

// ✅ config des 2 restos
export const RESTAURANTS: Record<RestaurantId, RestaurantConfig> = {
  resto_a: {
    id: "resto_a",
    label: env("RESTAURANT_A_LABEL") ?? "Minao Bruxelles",
    email: env("RESTAURANT_A_EMAIL"),
    creditorName: env("RESTAURANT_A_CREDITOR_NAME"),
    iban: env("RESTAURANT_A_IBAN"),
    bic: env("RESTAURANT_A_BIC"),
  },
  resto_b: {
    id: "resto_b",
    label: env("RESTAURANT_B_LABEL") ?? "Minao Dilbeek",
    email: env("RESTAURANT_B_EMAIL"),
    creditorName: env("RESTAURANT_B_CREDITOR_NAME"),
    iban: env("RESTAURANT_B_IBAN"),
    bic: env("RESTAURANT_B_BIC"),
  },
};

// ✅ récupère une config en garantissant un fallback
export function getRestaurantConfig(id?: string | null): RestaurantConfig {
  if (isRestaurantId(id)) return RESTAURANTS[id];
  return RESTAURANTS.resto_a; // défaut
}

// ✅ fallback email global si email resto manquant
export function getFallbackRestaurantEmail(): string | null {
  return env("RESTAURANT_EMAIL");
}

// ✅ adresse d’expéditeur pour Resend
export function getEmailFrom(): string {
  // idéal: configure RESEND_FROM="Minao <orders@ton-domaine-verify.resend.dev>"
  const configured = env("RESEND_FROM");
  if (configured) return configured;

  // si tu as configuré un domaine: RESEND_DOMAIN="mg.minaoasianfood.com"
  const domain = env("RESEND_DOMAIN");
  if (domain) return `Minao Asian Food <orders@${domain}>`;

  // fallback sandbox
  return "Minao Asian Food <onboarding@resend.dev>";
}

