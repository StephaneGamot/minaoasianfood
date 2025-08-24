'use client';

import Image from "next/image";
import { useState } from "react";
import { tagStyles } from "./tagStyles";
import Modal from "./Modal";
import { useCart, type CartItem as CtxCartItem } from "@/context/CartContext";

type Category = {
  id: number | string;
  name: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  price?: string;       // ex: "6,90 €"
  tags?: string[];
  searchTag?: string[];
};

interface MenuCardProps {
  categories: Category[];
}

// convertit "6,90 €" → 6.9
function parsePriceEUR(s?: string): number {
  if (!s) return 0;
  const n = Number(
    s.replace(/\s/g, "")
     .replace(",", ".")
     .replace(/[^\d.]/g, "")
  );
  return Number.isFinite(n) ? n : 0;
}

export default function MenuCard({ categories }: MenuCardProps) {
  const [selected, setSelected] = useState<Category | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selected) return;

    const id = Number(selected.id);
    const priceNumber = parsePriceEUR(selected.price);

    // On passe par le CartContext → mise à jour instantanée + persistance
    const item: CtxCartItem = {
      id,
      name: selected.name,
      priceNumber,
      price: selected.price ?? `${priceNumber.toFixed(2)} €`,
      imageSrc: selected.imageSrc,
      quantity: Math.max(1, Math.floor(quantity || 1)),
    };

    addToCart(item);

    // reset modal
    setSelected(null);
    setQuantity(1);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <div
            key={String(cat.id)}
            onClick={() => {
              setSelected(cat);
              setQuantity(1);
            }}
            className="group relative block cursor-pointer overflow-hidden rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md bg-white"
          >
            <div className="aspect-[3/2] overflow-hidden relative">
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
                <div className="mt-2 flex flex-wrap gap-0">
                  {cat.tags.slice(0, 2).map((tag, i) => {
                    const style = tagStyles[tag] || {
                      color: "bg-gray-200 text-gray-800",
                      icon: "🔖",
                    };
                    return (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${style.color}`}
                      >
                        <span>{style.icon}</span>
                        {tag}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selected}
        onClose={() => {
          setSelected(null);
          setQuantity(1);
        }}
      >
        {selected && (
          <div>
            <div className="aspect-[3/2] mb-4 overflow-hidden rounded-md">
              <Image
                src={selected.imageSrc}
                alt={selected.imageAlt}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>

            <h2 className="text-xl font-bold mb-2">{selected.name}</h2>
            <p className="text-sm text-gray-600 mb-4">{selected.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {selected.tags?.map((tag, i) => {
                const style = tagStyles[tag] || {
                  color: "bg-gray-200 text-gray-800",
                  icon: "🔖",
                };
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${style.color}`}
                  >
                    <span>{style.icon}</span>
                    {tag}
                  </span>
                );
              })}
            </div>

            <div className="flex items-center justify-between mb-4">
              {selected.price && (
                <p className="text-lg font-semibold text-red-800">
                  {selected.price}
                </p>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-8 w-8 flex items-center justify-center rounded bg-gray-200 text-lg font-bold"
                >
                  –
                </button>
                <span className="min-w-[24px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-8 w-8 flex items-center justify-center rounded bg-gray-200 text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-2 w-full rounded-lg bg-red-900 text-white py-2 hover:bg-red-800 transition"
            >
              Ajouter {quantity > 1 ? `${quantity}` : ""} au panier
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
