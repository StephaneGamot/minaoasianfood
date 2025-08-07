'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Role = 'guest' | 'user' | 'dashboard' | 'admin';

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>; // 🆕
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      const loggedUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as Role,
      };

      localStorage.setItem('authUser', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return true;
    } catch (err) {
      console.error('Erreur de connexion :', err);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      // Tu pourrais aussi récupérer et stocker l'utilisateur directement ici si tu veux login automatique
      return true;
    } catch (err) {
      console.error('Erreur d’inscription :', err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
