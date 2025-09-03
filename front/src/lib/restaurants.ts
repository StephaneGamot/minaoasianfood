// src/lib/restaurants.ts
export type RestaurantId = "resto_a" | "resto_b";

export type RestaurantConfig = {
  id: RestaurantId;
  label: string;
  email?: string | null;
  creditorName?: string | null;
  iban?: string | null;
  bic?: string | null;
};

const clean = (v?: string | null) =>
  (v ?? "").trim().replace(/^["']|["']$/g, "");

// ⚠️ Les valeurs sont lues depuis les variables d'environnement Vercel
export const RESTAURANTS: Record<RestaurantId, RestaurantConfig> = {
  resto_a: {
    id: "resto_a",
    label: clean(process.env.RESTAURANT_A_LABEL) || "Restaurant A",
    email: clean(process.env.RESTAURANT_A_EMAIL) || null,
    creditorName: clean(process.env.RESTAURANT_A_CREDITOR_NAME) || null,
    iban: clean(process.env.RESTAURANT_A_IBAN) || null,
    bic: clean(process.env.RESTAURANT_A_BIC) || null,
  },
  resto_b: {
    id: "resto_b",
    label: clean(process.env.RESTAURANT_B_LABEL) || "Restaurant B",
    email: clean(process.env.RESTAURANT_B_EMAIL) || null,
    creditorName: clean(process.env.RESTAURANT_B_CREDITOR_NAME) || null,
    iban: clean(process.env.RESTAURANT_B_IBAN) || null,
    bic: clean(process.env.RESTAURANT_B_BIC) || null,
  },
};

export function isRestaurantId(v: unknown): v is RestaurantId {
  return v === "resto_a" || v === "resto_b";
}

export function getRestaurantConfig(id?: string | null): RestaurantConfig {
  return isRestaurantId(id) ? RESTAURANTS[id] : RESTAURANTS.resto_a;
}

export function getFallbackRestaurantEmail(): string | null {
  const v = clean(process.env.RESTAURANT_EMAIL);
  return v || null;
}

export function getEmailFrom(): string {
  // Exemple: "Minao <noreply@minaoasianfood.com>"
  return clean(process.env.RESEND_FROM) || "Minao <onboarding@resend.dev>";
}
