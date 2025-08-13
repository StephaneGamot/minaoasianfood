"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type ServerRole = "USER" | "ADMIN" | "DASHBOARD" | "GUEST";
type Role = "guest" | "user" | "dashboard" | "admin";

type User = {
  id: number | string;
  // côté back, on a firstName/lastName ; tu stockais name: je le reconstitue
  name: string;
  email: string;
  role: Role;
  // tu peux ajouter d’autres champs de /me si tu veux (profilePicUrl, etc.)
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    lastName?: string
  ) => Promise<boolean>; // <- ajoute lastName
  logout: () => Promise<void>;
  // facultatif: fetch qui auto-refresh le token
  authedFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

// mappe les rôles du back vers tes rôles front
function normalizeRole(role?: ServerRole): Role {
  switch (role) {
    case "ADMIN":
      return "admin";
    case "DASHBOARD":
      return "dashboard";
    case "USER":
      return "user";
    default:
      return "guest";
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null); // token en mémoire uniquement
  const [loading, setLoading] = useState(true);

  // ---- Helpers ----
  async function fetchMe(token: string): Promise<User | null> {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const me = await res.json();
    const u: User = {
      id: me.id,
      name:
        [me.firstName, me.lastName].filter(Boolean).join(" ").trim() ||
        me.lastName ||
        me.email,
      email: me.email,
      role: normalizeRole(me.role),
    };
    return u;
  }

  async function refresh(): Promise<string | null> {
    const res = await fetch(`${API}/auth/refresh`, {
      method: "POST",
      credentials: "include", // indispensable pour envoyer le cookie HttpOnly
    });
    if (!res.ok) return null;
    const data = await res.json(); // { accessToken }
    return data?.accessToken ?? null;
  }

  // Restaure la session au premier rendu : tente un refresh, puis /me
  useEffect(() => {
    (async () => {
      try {
        const token = await refresh();
        if (token) {
          setAccessToken(token);
          const u = await fetchMe(token);
          if (u) setUser(u);
        } else {
          setUser(null);
          setAccessToken(null);
        }
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---- API ----
  // AuthContext – version sûre avec logs


const register = async (
  email: string,
  password: string,
  lastName = "User"
): Promise<boolean> => {
  try {
    const payload = { lastName: lastName.trim(), email: email.trim(), password };
    console.debug("[register] POST", `${API}/auth/register`, payload);

    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const bodyText = await res.text();
    console.debug("[register] status:", res.status, "body:", bodyText);

    // ✅ on considère l’inscription réussie si HTTP 200/201
    return res.ok;
  } catch (e) {
    console.error("[register] error:", e);
    return false;
  }
};

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // reçoit le cookie refresh
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;

      const data = await res.json(); // { accessToken }
      const token = data?.accessToken;
      if (!token) return false;

      setAccessToken(token);
      const u = await fetchMe(token);
      if (!u) return false;

      // on stocke uniquement l'utilisateur (pas le token)
      localStorage.setItem("authUser", JSON.stringify(u));
      setUser(u);
      return true;
    } catch (e) {
      console.error("Erreur de connexion :", e);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem("authUser");
      setUser(null);
      setAccessToken(null);
    }
  };

  // fetch avec auto-Authorization + tentative d’auto-refresh si 401
  const authedFetch = async (input: RequestInfo, init: RequestInit = {}) => {
    const token = accessToken ?? (await refresh());
    if (token && token !== accessToken) setAccessToken(token);

    const headers = new Headers(init.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);

    let res = await fetch(input, { ...init, headers, credentials: "include" });
    if (res.status === 401) {
      const newToken = await refresh();
      if (newToken) {
        setAccessToken(newToken);
        headers.set("Authorization", `Bearer ${newToken}`);
        res = await fetch(input, { ...init, headers, credentials: "include" });
      }
    }
    return res;
  };

  // Option: si tu veux restaurer l’utilisateur depuis localStorage pour l’UI instantanée
  useEffect(() => {
    try {
      const stored = localStorage.getItem("authUser");
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, authedFetch }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
