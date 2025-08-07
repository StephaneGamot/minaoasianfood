"use client";

import MenuCard from "../MenuCard";
import SaucePlatsData from "./SaucePlatsData.json" assert { type: "json" };

export default function SaucePlats() {
  return (
    <section className="bg-white py-2 px-1 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 id="dishes" className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Plats en sauces
        </h2>
        <MenuCard categories={SaucePlatsData} />
      </div>
    </section>
  );
}
