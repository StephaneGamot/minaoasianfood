'use client';

import { useState } from 'react';
import { useCart, type CartItem } from '@/context/CartContext';

type Props = {
  item: Omit<CartItem, 'quantity'> & { quantity?: number };
  className?: string;
  label?: string;
};

export default function AddToCartButton({ item, className, label = 'Ajouter au panier' }: Props) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const onAdd = () => {
    setAdding(true);

    const id = Number(item.id);
    const qty = Math.max(1, Math.floor(item.quantity ?? 1));
    const priceNumber = Number(item.priceNumber);

    addToCart({
      id,
      name: item.name,
      priceNumber,
      price: item.price ?? `${priceNumber.toFixed(2)} €`,
      imageSrc: item.imageSrc,
      quantity: qty,
    });

    setTimeout(() => setAdding(false), 250);
  };

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={adding}
      className={className ?? 'rounded bg-[#f47457] px-3 py-2 text-white hover:bg-red-500 disabled:opacity-50'}
    >
      {adding ? 'Ajout…' : label}
    </button>
  );
}
