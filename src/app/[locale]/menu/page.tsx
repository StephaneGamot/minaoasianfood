import React from "react";
import Starters from "@/components/Menu/Starters/Starters";
import Noodles from "@/components/Menu/Noodles/Noodles";
import Rice from "@/components/Menu/Rices/Rice";
import PadThai from "@/components/Menu/PadThai/PadThai";
import SaucePlats from "@/components/Menu/SaucePlats/SaucePlats";
import Baos from "@/components/Menu/Baos/Baos";
import Desserts from "@/components/Menu/Desserts/Desserts"
import Boissons from "@/components/Menu/Boissons/Boissons";

export default function page() {
  return (
    <section className="bg-white py-10 px-1 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Découvrez notre carte
        </h1>{" "}
      </div>

      <Starters />
      <Noodles />
      <Rice />
      <PadThai />
      <SaucePlats />
      <Baos />
      <Desserts />
      <Boissons />
    </section>
  );
}
