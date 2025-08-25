"use client";

import { useId } from "react";

export type RestaurantKey = "shopA" | "shopB";

const LABEL_A =
  process.env.NEXT_PUBLIC_SHOPA_LABEL?.trim() || "Minao Schaerbeek";
const LABEL_B =
  process.env.NEXT_PUBLIC_SHOPB_LABEL?.trim() || "Minao Dilbeek";

type Props = {
  value: RestaurantKey | "";                 // valeur contrôlée
  onChange: (val: RestaurantKey) => void;    // callback parent
  name?: string;                             // name du groupe radio
  required?: boolean;                        // validation HTML
};

export default function RestaurantSelector({
  value,
  onChange,
  name = "restaurant",
  required = true,
}: Props) {
  const groupId = useId();

  return (
    <fieldset className="rounded-lg border border-gray-200 p-4">
      <legend className="text-sm font-semibold text-gray-900">
        Choisissez votre restaurant
      </legend>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Restaurant A */}
        <label
          className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${
            value === "shopA" ? "border-red-700 ring-1 ring-red-700" : "border-gray-300"
          }`}
          htmlFor={`${groupId}-shopA`}
        >
          <input
            id={`${groupId}-shopA`}
            type="radio"
            name={name}
            value="shopA"
            checked={value === "shopA"}
            onChange={() => onChange("shopA")}
            // ✔️ Pour que la validation native marche, on met `required` sur 1 des inputs du groupe
            required={required}
          />
          <span className="font-medium">{LABEL_A}</span>
        </label>

        {/* Restaurant B */}
        <label
          className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${
            value === "shopB" ? "border-red-700 ring-1 ring-red-700" : "border-gray-300"
          }`}
          htmlFor={`${groupId}-shopB`}
        >
          <input
            id={`${groupId}-shopB`}
            type="radio"
            name={name}
            value="shopB"
            checked={value === "shopB"}
            onChange={() => onChange("shopB")}
          />
          <span className="font-medium">{LABEL_B}</span>
        </label>
      </div>

      {value === "" && (
        <p className="mt-2 text-xs text-red-700">
          Veuillez sélectionner un restaurant pour continuer.
        </p>
      )}
    </fieldset>
  );
}
