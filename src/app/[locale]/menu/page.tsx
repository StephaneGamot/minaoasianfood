import React from "react";
import Starters from "@/components/Menu/Starters";

export default function page() {
  return (
    <section className="bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Découvrez notre carte
        </h1>{" "}
      </div>

      <Starters />
    </section>
  );
}
