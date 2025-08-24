'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';

const STORAGE_KEY = 'cart';          // clé actuelle
const OLD_KEYS = ['cart.v1'];        // anciennes clés à migrer

export type CartItem = {
  id: number;
  name: string;
  price: string;
  priceNumber: number; // en euros (ex: 7.9)
  quantity: number;
  imageSrc: string;
};

type CartContextType = {
  loaded: boolean;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  // évite d’écrire dans le storage juste après un clear()
  const skipPersistOnce = useRef(false);

  // Hydratation + migration
  useEffect(() => {
    try {
      // 1) tente clé actuelle
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          setCart(parsed as CartItem[]);
          setLoaded(true);
          return;
        }
      }
      // 2) migration depuis anciennes clés
      for (const k of OLD_KEYS) {
        const oldRaw = localStorage.getItem(k);
        if (!oldRaw) continue;
        const parsed = JSON.parse(oldRaw) as unknown;
        if (Array.isArray(parsed)) {
          const list = parsed as CartItem[];
          setCart(list);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          localStorage.removeItem(k);
          break;
        }
      }
    } catch (e) {
      console.warn('[Cart] parse/migrate failed', e);
      // on repart propre
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
        const parsed = ev.newValue ? (JSON.parse(ev.newValue) as unknown) : [];
        if (Array.isArray(parsed)) setCart(parsed as CartItem[]);
      } catch {
        // ignore
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const qty = Math.max(1, Math.floor(item.quantity || 1));
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      for (const k of OLD_KEYS) localStorage.removeItem(k);
    } catch {
      // ignore
    }
    skipPersistOnce.current = true;
    setCart([]);
  }, []);

  const value = useMemo<CartContextType>(
    () => ({ loaded, cart, addToCart, removeFromCart, clearCart }),
    [loaded, cart, addToCart, removeFromCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
