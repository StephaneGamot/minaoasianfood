"use client";

import MenuCard from "./MenuCard";

const categories = [
  {
    id: 1,
    name: "Yakitoris poulet",
    description: "2 pièces",
    href: "/menu/nouveautes",
    imageSrc: "/images/menu/nouveautes.jpg",
    imageAlt: "Photo des nouveautés Minao",
    price: "6,70 €",
    tags: ["Entrée", "Poulet"],
  },
  {
    id: 2,
    name: "Karaag poulet",
    description: "5 pièces",
    href: "/menu/incontournables",
    imageSrc: "/images/menu/incontournables.jpg",
    imageAlt: "Plat iconique Minao",
    price: "7,40 €",
    tags: ["Entrée", "Poulet"],
  },
  {
    id: 3,
    name: "Tempuras scampis",
    description: "3 pièces",
    href: "/menu/entrees",
    imageSrc: "/images/menu/entrees.jpg",
    imageAlt: "Entrées asiatiques",
    price: "6,00 €",
    tags: ["Entrée", "Fruit de mer"],
  },
  {
    id: 4,
    name: "Nems veggie",
    description: "4 pièces",
    href: "/menu/bao",
    imageSrc: "/images/menu/bao.jpg",
    imageAlt: "Bao buns vapeur",
    price: "6,00 €",
    tags: ["Entrée", "Végétarien"],
  },
  {
    id: 5,
    name: "Nems poulet",
    description: "4 pièces",
    href: "/menu/nouveautes",
    imageSrc: "/images/menu/nouveautes.jpg",
    imageAlt: "Photo des nouveautés Minao",
    price: "6,50 €",
    tags: ["Entrée", "Poulet"],
  },
  {
    id: 6,
    name: "Gyozas veggie",
    description: "4 pièces",
    href: "/menu/incontournables",
    imageSrc: "/images/menu/incontournables.jpg",
    imageAlt: "Plat iconique Minao",
    price: "6,00 €",
    tags: ["Entrée", "Végétarien"],
  },
  {
    id: 7,
    name: "Gyozas poulet",
    description: "4 pièces",
    href: "/menu/entrees",
    imageSrc: "/images/menu/entrees.jpg",
    imageAlt: "Entrées asiatiques",
    price: "6,50 €",
    tags: ["Entrée", "Poulet"],
  },
  {
    id: 8,
    name: "Gyozas scampi",
    description: "4 pièces",
    href: "/menu/bao",
    imageSrc: "/images/menu/bao.jpg",
    imageAlt: "Bao buns vapeur",
    price: "6,90 €",
    tags: ["Entrée", "Fruit de mer"],
  },
  {
    id: 9,
    name: "Salade poulet façon thaï",
    description: "Poulet caramélisé, légumes pickles et vermicelles.",
    href: "/menu/nouveautes",
    imageSrc: "/images/menu/nouveautes.jpg",
    imageAlt: "Photo des nouveautés Minao",
    price: "11,90 €",
    tags: ["Entrée", "Poulet"],
  },
  {
    id: 10,
    name: "Salade scampis façon thaï",
    description: "Scampis saté, légumes pickles et vermicelles.",
    href: "/menu/incontournables",
    imageSrc: "/images/menu/incontournables.jpg",
    imageAlt: "Plat iconique Minao",
    price: "12,90 €",
    tags: ["Entrée", "Fruit de mer"],
  },
];

export default function Starters() {
  return (
    <section className="bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Nos entrées
        </h2>
        <MenuCard categories={categories} />
      </div>
    </section>
  );
}
