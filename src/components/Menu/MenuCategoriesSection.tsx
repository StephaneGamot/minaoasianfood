"use client";

import Link from "next/link";
import Image from "next/image";
import Entrees from "./../../../public/images/menu/entrees.jpg"
import Riz     from "./../../../public/images/menu/riz.jpg"
import Bao from "./../../../public/images/menu/bao.jpg"
import Nouilles from "./../../../public/images/menu/nouilles.jpg"
import PasThai from "./../../../public/images/menu/pad-thai.jpg"
import Desserts from "./../../../public/images/menu/desserts.jpg"
import Boissons from "./../../../public/images/menu/boissons.jpg"
import PlatsSauce from "./../../../public/images/menu/plats-sauce.jpg"
import Incontournables from "./../../../public/images/menu/incontournables.jpg"
import Nouveautes from "./../../../public/images/menu/nouveautes.jpg"

const categories = [
  {
    id: 1,
    name: "Nouveautés",
    description: "Les derniers plats ajoutés à notre carte.",
    href: "/menu/nouveautes",
    imageSrc: Nouveautes,
    imageAlt: "Découvrez les nouveautés de la carte.",
  },
  {
    id: 2,
    name: "Incontournables",
    description: "Les favoris de nos clients, à ne pas manquer.",
    href: "/menu/incontournables",
    imageSrc: Incontournables,
    imageAlt: "Les plats les plus populaires.",
  },
  {
    id: 3,
    name: "Entrées",
    description: "Pour bien commencer votre repas.",
    href: "/menu/entrees",
    imageSrc: Entrees,
    imageAlt: "Variété d’entrées asiatiques.",
  },
  {
    id: 4,
    name: "Bao",
    description: "Savoureux petits pains vapeur et bouchées chinoises.",
    href: "/menu/bao",
    imageSrc: Bao,
    imageAlt: "Petits pains vapeur savoureux.",
  },
  {
    id: 5,
    name: "Plats en sauce",
    description: "Des plats mijotés riches en saveurs.",
    href: "/menu/plats-sauce",
    imageSrc: PlatsSauce,
    imageAlt: "Plats mijotés à la sauce asiatique.",
  },
  {
    id: 6,
    name: "Riz sautés",
    description: "Parfumés, complets et savoureux.",
    href: "/menu/riz",
    imageSrc: Riz,
    imageAlt: "Riz sauté aux saveurs variées.",
  },
  {
    id: 7,
    name: "Nouilles sautées",
    description: "Le goût du wok dans chaque bouchée.",
    href: "/menu/nouilles",
    imageSrc: Nouilles,
    imageAlt: "Nouilles sautées au wok.",
  },
  {
    id: 8,
    name: "Pad Thaï",
    description: "Une spécialité thaïlandaise adorée.",
    href: "/menu/pad-thai",
    imageSrc: PasThai,
    imageAlt: "Authentique Pad Thaï aux crevettes.",
  },
  {
    id: 9,
    name: "Desserts",
    description: "Une touche sucrée pour finir en beauté.",
    href: "/menu/desserts",
    imageSrc: Desserts,
    imageAlt: "Desserts asiatiques sucrés.",
  },
  {
    id: 10,
    name: "Boissons",
    description: "Fraîcheur et tradition asiatique.",
    href: "/menu/boissons",
    imageSrc: Boissons,
    imageAlt: "Boissons fraîches ou chaudes.",
  },
];

export default function MenuCategoriesSection() {
  return (
    <section className="bg-stone-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
          Explorez notre carte
        </h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group block rounded-xl overflow-hidden shadow hover:shadow-xl transition"
            >
              <div className="aspect-[3/2] relative overflow-hidden">
                <Image
                  src={cat.imageSrc}
                  alt={cat.imageAlt}
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="bg-white p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
