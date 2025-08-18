// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ServerRole = "USER" | "ADMIN" | "DASHBOARD" | "GUEST";
type Role = "guest" | "user" | "dashboard" | "admin";
type User = { id: number | string; name: string; email: string; role: Role };

type AuthContextType = {
  user: User | null;
  loading: boolean; // chargeur local (utilisé surtout par ensureSession)
  isAuthenticated: boolean;
  /** À appeler SEULEMENT sur pages protégées (ou avant d’appeler une API sensible) */
  ensureSession: () => Promise<boolean>;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  register: (email: string, password: string, lastName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  /** fetch qui ajoute le Bearer et tente un refresh sur 401 */
  authedFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Base API (reverse-proxy Next: /api, sinon ex: http://localhost:8080)
const API = process.env.NEXT_PUBLIC_API_BASE ?? "/api";
const HAD_SESSION_KEY = "authHadSession"; // marque qu’une session a existé sur ce device

function normalizeRole(r?: ServerRole): Role {
  switch (r) {
    case "ADMIN": return "admin";
    case "DASHBOARD": return "dashboard";
    case "USER": return "user";
    default: return "guest";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null); // non persisté
  const [loading, setLoading] = useState(false); // ❗️on ne bloque plus l’UI globale

  // Hydrate rapide depuis localStorage (aucun appel réseau au mount)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("authUser");
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // noop
    }
  }, []);

  async function fetchMe(token: string): Promise<User | null> {
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) return null;
      const me = await res.json();
      const name =
        [me.firstName, me.lastName].filter(Boolean).join(" ").trim() ||
        me.lastName ||
        me.email;
      return { id: me.id, name, email: me.email, role: normalizeRole(me.role as ServerRole) };
    } catch {
      return null;
    }
  }

  async function refresh(): Promise<string | null> {
    try {
      const res = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return null;

      const text = await res.text(); // plus robuste que res.json() si vide
      if (!text) return null;
      let token: string | null = null;
      try {
        const data = JSON.parse(text);
        token = data?.accessToken ?? null;
      } catch {
        token = null;
      }
      return token;
    } catch {
      return null;
    }
  }

  // 🔒 À utiliser UNIQUEMENT sur pages protégées
  const ensureSession = async (): Promise<boolean> => {
    if (user) return true;

    const had = typeof window !== "undefined" && localStorage.getItem(HAD_SESSION_KEY) === "1";
    if (!had) return false; // aucune session connue -> pas la peine de tenter

    setLoading(true);
    try {
      const token = await refresh();
      if (!token) return false;
      setAccessToken(token);

      const u = await fetchMe(token);
      if (!u) return false;

      setUser(u);
      localStorage.setItem("authUser", JSON.stringify(u));
      return true;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, lastName = "User"): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastName: lastName.trim(),
          email: email.trim(),
          password,
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const login = async (email: string, password: string, remember = false): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        // ⚠️ rememberMe côté back = durée du cookie refresh (Max-Age)
        body: JSON.stringify({ email, password, rememberMe: remember }),
      });

      const text = await res.text();
      if (!res.ok || !text) return false;

      let token: string | null = null;
      try {
        token = (JSON.parse(text))?.accessToken ?? null;
      } catch {
        token = null;
      }
      if (!token) return false;

      setAccessToken(token);

      const u = await fetchMe(token);
      if (!u) return false;

      localStorage.setItem("authUser", JSON.stringify(u));
      localStorage.setItem(HAD_SESSION_KEY, "1"); // ✅ autorise un futur refresh paresseux
      setUser(u);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // noop
    } finally {
      localStorage.removeItem(HAD_SESSION_KEY);
      localStorage.removeItem("authUser");
      setUser(null);
      setAccessToken(null);
    }
  };

  // 🔐 fetch avec tentative de refresh sur 401 (lazy)
  const authedFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const headers = new Headers(init.headers || {});
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

    let res = await fetch(input, { ...init, headers, credentials: "include" });

    if (res.status === 401) {
      // Évite d’appeler /refresh si aucune session n’a jamais existé
      const had = typeof window !== "undefined" && localStorage.getItem(HAD_SESSION_KEY) === "1";
      if (!had) return res;

      const newToken = await refresh();
      if (newToken) {
        setAccessToken(newToken);

        // On tente aussi de resynchroniser le user (utile si onglet resté longtemps ouvert)
        const me = await fetchMe(newToken);
        if (me) {
          setUser(me);
          localStorage.setItem("authUser", JSON.stringify(me));
        }

        headers.set("Authorization", `Bearer ${newToken}`);
        res = await fetch(input, { ...init, headers, credentials: "include" });
      }
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        ensureSession,
        login,
        register,
        logout,
        authedFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook nommé — importer via:  import { useAuth } from "@/context/AuthContext";
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
