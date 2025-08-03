"use client";

import MenuCard from "../MenuCard";
import BoissonsData from "./BoissonsData.json" assert { type: "json" };

export default function Boissons() {
  return (
    <section className="bg-white py-2 px-1 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 id="drinks" className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Nos boissons
        </h2>
        <MenuCard categories={BoissonsData} />
      </div>
    </section>
  );
}
