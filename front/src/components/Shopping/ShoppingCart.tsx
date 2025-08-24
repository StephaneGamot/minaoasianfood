'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useMemo } from 'react';
import { useCart } from '@/context/CartContext';

export default function ShoppingCart() {
  const { cart, removeFromCart, loaded } = useCart();
  const router = useRouter();
  const locale = useLocale();

  const deliveryFee = 4.9;
  const isDisabled = !loaded || cart.length === 0;

  const cartSignature = useMemo(
    () => cart.map(i => `${i.id}:${i.quantity}`).sort().join('|'),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.priceNumber * item.quantity, 0),
    [cart]
  );

  const total = useMemo(
    () => (cart.length ? subtotal + deliveryFee : 0),
    [subtotal, cart.length]
  );

  const EUR = useMemo(
    () => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }),
    [locale]
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!loaded || !cart.length) return;
    router.push(`/${locale}/checkout`);
  };

  return (
    <div className="bg-white" key={cartSignature}>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          🛒 Panier
        </h1>

        {/* État de chargement */}
        {!loaded && (
          <div
            role="status"
            aria-live="polite"
            className="mt-8 rounded-md border border-gray-200 p-6 text-center text-gray-700"
          >
            Chargement du panier…
          </div>
        )}

        {/* Panier vide */}
        {loaded && !cart.length && (
          <div
            role="status"
            aria-live="polite"
            className="mt-8 rounded-md border border-gray-200 p-6 text-center text-gray-700"
          >
            Votre panier est vide pour l’instant.
          </div>
        )}

        {/* Liste + totaux */}
        <form className="mt-12" onSubmit={handleSubmit} aria-describedby="order-summary">
          <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
            {cart.map((item) => (
              <li key={item.id} className="flex py-6">
                <div className="shrink-0">
                  <Image
                    src={item.imageSrc}
                    alt={item.name}
                    className="size-24 rounded-md object-cover sm:size-32"
                    width={128}
                    height={128}
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-700">{item.name}</h4>
                    <p className="ml-4 text-sm text-gray-900">
                      {EUR.format(item.priceNumber * item.quantity)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Quantité : {item.quantity}</p>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm font-medium text-red-700 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div id="order-summary" className="mt-10 space-y-4">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <span>Sous-total</span>
              <span>{EUR.format(subtotal)}</span>
            </div>
            <div className="flex justify-between text-base text-gray-700">
              <span>Frais de livraison</span>
              <span>{cart.length ? EUR.format(deliveryFee) : EUR.format(0)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{EUR.format(total)}</span>
            </div>
            <button
              type="submit"
              disabled={isDisabled}
              className="mt-6 w-full rounded-md bg-red-900 px-4 py-3 text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Valider la commande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
