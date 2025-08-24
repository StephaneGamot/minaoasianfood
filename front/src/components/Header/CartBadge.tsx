'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function CartBadge() {
  const { cart } = useCart();
  const locale = useLocale();

  const count = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <Link
      href={`/${locale}/panier`}
      className="relative text-stone-100 hover:text-white transition"
      aria-label="Voir le panier"
    >
      <ShoppingCartIcon className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
