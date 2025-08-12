"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type RegisterFormProps = {
  redirectTo?: string; // ex: "/dashboard" ou "/login"
};

export default function RegisterForm({ redirectTo = "/dashboard" }: RegisterFormProps) {
  const router = useRouter();
  const { register: ctxRegister } = useAuth(); // doit exister dans ton AuthContext

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirm) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!ctxRegister) {
      setError("Le service d’inscription est indisponible.");
      return;
    }

    try {
      setLoading(true);

const ok = await (ctxRegister as unknown as (email: string, password: string, name?: string) => Promise<boolean>)(
  email,
  password,
  name
);

      if (!ok) {
        setError("Impossible de créer le compte. Réessayez.");
        return;
      }
      router.push(redirectTo);
    } catch (e) {
      console.error(e);
      setError("Erreur lors de l’inscription.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-center mb-6">Créer un compte</h1>

        {/* Région live (toujours présente) */}
        <p id="register-status" role="status" aria-live="polite" className="sr-only">
          {loading ? "Création du compte en cours…" : ""}
        </p>

        {/* Zone d’erreur (toujours dans le DOM) */}
        <div
          id="register-error"
          role="alert"
          aria-live="assertive"
          className={error ? "mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" : "sr-only"}
        >
          {error || ""}
        </div>

        {/* Aide mot de passe (toujours présente pour aria-describedby) */}
        <p id="password-help" className="sr-only">
          Votre mot de passe doit contenir au moins 6 caractères.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulaire d’inscription">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium">
              Nom
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Votre nom"
              className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-required="true"
              aria-describedby="register-error"
            />
          </div>

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
              aria-describedby="register-error"
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
                autoComplete="new-password"
                placeholder="Créer un mot de passe"
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-300 pr-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
                aria-describedby="register-error password-help"
                minLength={6}
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

          <div className="space-y-1">
            <label htmlFor="confirm" className="text-sm font-medium">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirmPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Répétez le mot de passe"
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-300 pr-14"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                aria-required="true"
                aria-describedby="register-error password-help"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPwd((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800 px-2 py-1"
                aria-label={showConfirmPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showConfirmPwd ? "Masquer" : "Afficher"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-900 text-white py-2 rounded-md hover:bg-red-800 disabled:opacity-60"
          >
            {loading ? "Création du compte..." : "S’inscrire"}
          </button>

          <p className="text-sm mt-2 text-center">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-red-700 hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
