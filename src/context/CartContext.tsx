"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 🛒 Type d’un article du panier
export type CartItem = {
  id: number;
  name: string;
  price: string;
  quantity: number;
  imageSrc: string;
};

// 🎁 Type du contexte
type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
};

// 📦 Contexte initial vide (sera rempli plus bas)
const CartContext = createContext<CartContextType | undefined>(undefined);

// 📂 Props pour le Provider
type CartProviderProps = {
  children: ReactNode;
};

// ✅ Composant Provider
export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

// ✅ Hook personnalisé avec vérification
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
