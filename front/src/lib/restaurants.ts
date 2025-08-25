export type RestaurantId = "resto_a" | "resto_b";

export type RestaurantConfig = {
  id: RestaurantId;
  label: string;           // libellé pour l’UI (ex. "Minao Woluwe")
  email: string;           // email du resto
  creditorName?: string;   // pour virement
  iban?: string;           // pour virement
  bic?: string;            // pour virement
};

export const RESTAURANTS: Record<RestaurantId, RestaurantConfig> = {
  resto_a: {
    id: "resto_a",
    label: process.env.RESTAURANT_A_LABEL ?? "Restaurant A",
    email:
      process.env.RESTAURANT_A_EMAIL ??
      process.env.RESTAURANT_EMAIL ??           // fallback global
      "",
    creditorName: process.env.RESTAURANT_A_CREDITOR_NAME,
    iban: process.env.RESTAURANT_A_IBAN,
    bic: process.env.RESTAURANT_A_BIC,
  },
  resto_b: {
    id: "resto_b",
    label: process.env.RESTAURANT_B_LABEL ?? "Restaurant B",
    email:
      process.env.RESTAURANT_B_EMAIL ??
      process.env.RESTAURANT_EMAIL ??           // fallback global
      "",
    creditorName: process.env.RESTAURANT_B_CREDITOR_NAME,
    iban: process.env.RESTAURANT_B_IBAN,
    bic: process.env.RESTAURANT_B_BIC,
  },
};

export function resolveRestaurant(id?: string | null): RestaurantConfig {
  if (id && (id === "resto_a" || id === "resto_b")) return RESTAURANTS[id];
  return RESTAURANTS.resto_a; // défaut
}
