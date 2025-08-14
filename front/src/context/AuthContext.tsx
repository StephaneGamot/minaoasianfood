// src/context/AuthContext.tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';

type ServerRole = 'USER' | 'ADMIN' | 'DASHBOARD' | 'GUEST';
type Role = 'guest' | 'user' | 'dashboard' | 'admin';

type User = {
  id: number | string;
  name: string;      
  email: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, lastName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authedFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = process.env.NEXT_PUBLIC_API_BASE || '/api';
const HAD_SESSION_KEY = 'authHadSession'; 

// --- helpers ---
function normalizeRole(role?: ServerRole): Role {
  switch (role) {
    case 'ADMIN': return 'admin';
    case 'DASHBOARD': return 'dashboard';
    case 'USER': return 'user';
    default: return 'guest';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe(token: string): Promise<User | null> {
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
        credentials: 'include'
      });
      if (!res.ok) return null;
      const me = await res.json();
      const name =
        [me.firstName, me.lastName].filter(Boolean).join(' ').trim() ||
        me.lastName ||
        me.email;
      return {
        id: me.id,
        name,
        email: me.email,
        role: normalizeRole(me.role as ServerRole)
      };
    } catch {
      return null;
    }
  }

  async function refresh(): Promise<string | null> {
    try {
      const res = await fetch(`${API}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      });
      // Pas de cookie / cookie invalide : session anonyme, c'est OK
      if (res.status === 401 || res.status === 403) return null;
      if (!res.ok) return null;

      // Certaines implémentations renvoient 204 : protège le parse
      const text = await res.text();
      if (!text) return null;
      const data = JSON.parse(text);
      return data?.accessToken ?? null;
    } catch {
      return null;
    }
  }

  // Bootstrap session au montage
useEffect(() => {
    (async () => {
      try {
        // ⛔️ si aucune session précédente, ne PAS appeler /refresh
        const hadSession = typeof window !== 'undefined' && localStorage.getItem(HAD_SESSION_KEY) === '1';
        if (!hadSession) {
          setUser(null);
          setAccessToken(null);
          return;
        }

        const token = await refresh();
        if (token) {
          setAccessToken(token);
          const u = await fetchMe(token);
          if (u) {
            setUser(u);
            localStorage.setItem('authUser', JSON.stringify(u));
          } else {
            setUser(null);
            localStorage.removeItem('authUser');
          }
        } else {
          setUser(null);
          localStorage.removeItem('authUser');
        }
      } finally {
        setLoading(false); // toujours débloquer le rendu
      }
    })();
  }, []);


  // Option: restaurer l’UI rapidement (si tu veux)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('authUser');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  // --- API exposée ---
  const register = async (email: string, password: string, lastName = 'User'): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastName: lastName.trim(),
          email: email.trim(),
          password
        })
      });
      if (!res.ok) return false;

      // pas d’auto-login → retourne true
      return true;
    } catch {
      return false;
    }
  };

  // AuthContext.tsx (dans AuthProvider)
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    // 👇 capture la réponse brute pour debug
    const text = await res.text();

    let token: string | null = null;
    try {
      const data = JSON.parse(text);
      console.debug('[login] status =', res.status, 'body =', data);
      token = data?.accessToken ?? null;
    } catch {
      console.debug('[login] raw body was not JSON:', text);
    }

    if (!res.ok || !token) return false;

    setAccessToken(token);
    const u = await fetchMe(token);
    if (!u) return false;

    localStorage.setItem('authUser', JSON.stringify(u));
    setUser(u);
    return true;
  } catch (e) {
    console.error('[login] error:', e);
    return false;
  }
};


  const logout = async (): Promise<void> => {
    try {
      await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {}
    // ✅ effacer le marqueur de session
    localStorage.removeItem(HAD_SESSION_KEY);
    localStorage.removeItem('authUser');
    setUser(null);
    setAccessToken(null);
  };

  const authedFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const token = accessToken ?? (await refresh());
    if (token && token !== accessToken) setAccessToken(token);

    const headers = new Headers(init.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);

    let res = await fetch(input, { ...init, headers, credentials: 'include' });
    if (res.status === 401) {
      const newToken = await refresh();
      if (newToken) {
        setAccessToken(newToken);
        headers.set('Authorization', `Bearer ${newToken}`);
        res = await fetch(input, { ...init, headers, credentials: 'include' });
      }
    }
    return res;
  };

  // ✅ on REND TOUJOURS les children (pas de !loading && children)
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, authedFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
