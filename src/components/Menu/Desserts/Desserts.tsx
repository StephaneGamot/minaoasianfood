"use client";

import MenuCard from "../MenuCard";
import DessertsData from "./DessertsData.json" assert { type: "json" };

export default function Desserts() {
  return (
    <section className="bg-white py-2 px-1 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 id="sweets" className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Nos desserts
        </h2>
        <MenuCard categories={DessertsData} />
      </div>
    </section>
  );
}
