'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';

const STORAGE_KEY = 'cart';           // ← clé stable
const OLD_KEYS = ['cart.v1'];         // ← migration depuis anciennes clés

export type CartItem = {
  id: number;
  name: string;
  price: string;
  priceNumber: number; // euros (ex: 7.9)
  quantity: number;
  imageSrc: string;
};

type CartContextType = {
  cart: CartItem[];
  loaded: boolean;                            // ← expose l’état d’hydratation
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const skipPersistOnce = useRef(false);

  // Hydratation + migration
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setCart(parsed);
          setLoaded(true);
          return;
        }
      }
      // migration depuis anciennes clés
      for (const k of OLD_KEYS) {
        const oldRaw = localStorage.getItem(k);
        if (!oldRaw) continue;
        const parsed = JSON.parse(oldRaw) as CartItem[];
        if (Array.isArray(parsed)) {
          setCart(parsed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          localStorage.removeItem(k);
          break;
        }
      }
    } catch (e) {
      console.warn('[Cart] parse/migrate failed', e);
      localStorage.removeItem(STORAGE_KEY);
      for (const k of OLD_KEYS) localStorage.removeItem(k);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Persistance
  useEffect(() => {
    if (!loaded) return;
    if (skipPersistOnce.current) {
      skipPersistOnce.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('[Cart] persist failed', e);
    }
  }, [cart, loaded]);

  // Sync entre onglets
  useEffect(() => {
    const onStorage = (ev: StorageEvent) => {
      if (ev.key !== STORAGE_KEY) return;
      try {
        const parsed = ev.newValue ? (JSON.parse(ev.newValue) as CartItem[]) : [];
        if (Array.isArray(parsed)) setCart(parsed);
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const qty = Math.max(1, Math.floor(item.quantity || 1));
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      for (const k of OLD_KEYS) localStorage.removeItem(k);
    } catch {}
    skipPersistOnce.current = true;
    setCart([]);
  };

  const value: CartContextType = { cart, loaded, addToCart, removeFromCart, clearCart };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

