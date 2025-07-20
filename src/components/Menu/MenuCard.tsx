"use client";

import Image from "next/image";
import Link from "next/link";
import { tagStyles } from "./tagStyles";

type Category = {
  id: number;
  name: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  price?: string;
  tags?: string[];
};

interface MenuCardProps {
  categories: Category[];
}

export default function MenuCard({ categories }: MenuCardProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={cat.href}
          className="group relative block overflow-hidden rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md bg-white"
        >
          <div className="aspect-[3/2] overflow-hidden">
            <Image
              src={cat.imageSrc}
              alt={cat.imageAlt}
              width={400}
              height={266}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
            {cat.price && (
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md z-10">
                {cat.price}
              </div>
            )}
          </div>

          <div className="p-2">
            <h3 className="text-sm font-bold text-gray-900">{cat.name}</h3>
            <p className="mt-1 text-xs text-gray-500">{cat.description}</p>

            {cat.tags && cat.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {cat.tags.map((tag, i) => {
                  const style = tagStyles[tag] || {
                    color: "bg-gray-200 text-gray-800",
                    icon: "🔖",
                  };
                  return (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 rounded-full px-1 py-1 text-xs font-medium ${style.color}`}
                    >
                      <span>{style.icon}</span>
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
