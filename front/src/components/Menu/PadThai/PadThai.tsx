"use client";

import MenuCard from "../MenuCard";
import PadThaiData from "./PadThaiData.json" assert { type: "json" };

export default function PadThai() {
  return (
    <section className="bg-white py-2 px-1 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 id="pad" className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Pad thaï
        </h2>
        <MenuCard categories={PadThaiData} />
      </div>
    </section>
  );
}
