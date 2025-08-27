// src/lib/restaurants.ts
export type RestaurantId = "resto_a" | "resto_b";

function readEnv(key: string): string {
  // lit, trim, et enlève les guillemets éventuels au début/fin
  const v = process.env[key];
  if (!v) return "";
  return v.trim().replace(/^["']|["']$/g, "");
}

export const RESTAURANTS: Record<
  RestaurantId,
  {
    id: RestaurantId;
    label: string;
    email: string;
    creditorName: string;
    iban: string;
    bic?: string;
  }
> = {
  resto_a: {
    id: "resto_a",
    label: readEnv("RESTAURANT_A_LABEL") || "Minao Bruxelles",
    email: readEnv("RESTAURANT_A_EMAIL"),
    creditorName: readEnv("RESTAURANT_A_CREDITOR_NAME") || "Minao Bruxelles",
    iban: readEnv("RESTAURANT_A_IBAN"),
    bic: readEnv("RESTAURANT_A_BIC") || undefined,
  },
  resto_b: {
    id: "resto_b",
    label: readEnv("RESTAURANT_B_LABEL") || "Minao Dilbeek",
    email: readEnv("RESTAURANT_B_EMAIL"),
    creditorName: readEnv("RESTAURANT_B_CREDITOR_NAME") || "Minao Dilbeek",
    iban: readEnv("RESTAURANT_B_IBAN"),
    bic: readEnv("RESTAURANT_B_BIC") || undefined,
  },
};

export function isRestaurantId(v: unknown): v is RestaurantId {
  return v === "resto_a" || v === "resto_b";
}

export function getRestaurantConfig(id?: string) {
  return RESTAURANTS[isRestaurantId(id) ? id : "resto_a"];
}

export function getFallbackRestaurantEmail(): string | null {
  const fallback = readEnv("RESTAURANT_EMAIL");
  return fallback || RESTAURANTS.resto_a.email || RESTAURANTS.resto_b.email || null;
}

export function getEmailFrom(): string {
  // Idéalement un domaine vérifié Resend (ex: orders@minaoasianfood.com)
  // Sinon, en dépannage: "Minao <onboarding@resend.dev>"
  const v = readEnv("RESEND_FROM");
  return v || "Minao <onboarding@resend.dev>";
}
