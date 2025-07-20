"use client";

import MenuCard from "../MenuCard";

import StartersData from "./StartersData.json" assert { type: "json" };


export default function Starters() {
  return (
    <section className="bg-white py-2 px-1 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Nos entrées
        </h2>
        <MenuCard categories={StartersData} />
      </div>
    </section>
  );
}
