"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslations, useLocale } from 'next-intl';

type LoginFormProps = {
  redirectTo?: string; // ex: "/dashboard"
  onSubmit?: (email: string, password: string) => Promise<boolean>;
};

export default function LoginForm({
  redirectTo = "/dashboard",
  onSubmit,
}: LoginFormProps) {
  const router = useRouter();
  const { login: ctxLogin } = useAuth();
  const login = onSubmit ?? ctxLogin;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

    const locale = useLocale();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (!login) {
      setError("Le service d’authentification est indisponible.");
      return;
    }

    try {
      setLoading(true);
      const ok = await login(email, password);
      if (!ok) {
        setError("Email ou mot de passe incorrect.");
        return;
      }
      router.push(redirectTo);
    } catch (e) {
      console.error(e);
      setError("Erreur lors de la connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-center mb-6">Connexion</h1>

        {/* Région live (toujours rendue) pour annoncer l'état et les erreurs */}
        <p
          id="form-status"
          role="status"
          aria-live="polite"
          className="sr-only"
        >
          {loading ? "Connexion en cours…" : ""}
        </p>

        {/* Zone d'erreur toujours présente : visible si erreur, sinon masquée visuellement mais existante pour aria-describedby */}
        <div
          id="form-error"
          role="alert"
          aria-live="assertive"
          className={error ? "mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" : "sr-only"}
        >
          {error || ""}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulaire de connexion">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              aria-describedby="form-error"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Votre mot de passe"
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-300 pr-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
                aria-describedby="form-error"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800 px-2 py-1"
                aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPwd ? "Masquer" : "Afficher"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
              <span>Se souvenir de moi</span>
            </label>
            <Link href="/forgot-password" className="text-red-700 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-900 text-white py-2 rounded-md hover:bg-red-800 disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <p className="text-sm mt-2 text-center">
            Pas encore de compte ?{" "}
            <Link href={`/${locale}/register`} className="text-red-700 hover:underline">
              Créer un compte
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
