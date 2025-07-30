"use client";

// import { CheckIcon } from '@heroicons/react/20/solid';
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function ShoppingCart() {
  const { cart, removeFromCart } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.priceNumber * item.quantity,
    0
  );
const deliveryFee = 4.9;
const total = subtotal + deliveryFee;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          🛒 Panier
        </h1>

        <form className="mt-12">
          <ul
            role="list"
            className="divide-y divide-gray-200 border-b border-t border-gray-200"
          >
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
                    <h4 className="text-sm font-medium text-gray-700">
                      {item.name}
                    </h4>
                    <p className="ml-4 text-sm text-gray-900">
                      {(item.priceNumber * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Quantité : {item.quantity}
                  </p>
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

          {/* Résumé */}
          <div className="mt-10 space-y-4">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div><div className="flex justify-between text-base text-gray-700">
  <span>Frais de livraison</span>
  <span>{deliveryFee.toFixed(2)} €</span>
</div>

<div className="flex justify-between text-lg font-bold text-gray-900">
  <span>Total</span>
  <span>{total.toFixed(2)} €</span>
</div>


            <button
              type="submit"
              className="mt-6 w-full rounded-md bg-red-900 px-4 py-3 text-white hover:bg-red-800"
            >
              Valider la commande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
