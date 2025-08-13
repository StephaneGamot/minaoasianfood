"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslations, useLocale } from "next-intl";

type RegisterFormProps = {
  /** Où rediriger après inscription. Par défaut: /{locale}/login */
  redirectTo?: string;
};

export default function RegisterForm({ redirectTo }: RegisterFormProps) {
  // i18n
  const t = useTranslations("registerForm");
  const locale = useLocale();

  // nav + auth
  const router = useRouter();
  const { register: ctxRegister } = useAuth();

  // états
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // redirection finale (prop > par défaut selon la locale)
  const finalRedirect = redirectTo ?? `/${locale}/login`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    // validations basiques
    if (!lastName || !email || !password || !confirm) {
      setError(t("fillAll"));
      return;
    }
    if (password !== confirm) {
      setError(t("pwdNoMatch"));
      return;
    }
    if (!ctxRegister) {
      setError(t("createFail"));
      return;
    }

    try {
      setLoading(true);
      const ok = await ctxRegister(email, password, lastName);
      if (!ok) {
        setError(t("createFail"));
        return;
      }
      router.push(finalRedirect);
    } catch (err) {
      // essaye d’extraire un message d’erreur JSON si le backend en renvoie
      if (err instanceof Error) console.error(err.message);
      setError(t("errorRegister"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-center mb-6">
          {t("title")}
        </h1>

        {/* Région live */}
        <p id="register-status" role="status" aria-live="polite" className="sr-only">
          {loading ? t("creating") : ""}
        </p>

        {/* Zone d’erreur persistante pour aria-describedby */}
        <div
          id="register-error"
          role="alert"
          aria-live="assertive"
          className={
            error
              ? "mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              : "sr-only"
          }
        >
          {error}
        </div>

        {/* Aide mot de passe persistante pour aria-describedby */}
        <p id="password-help" className="sr-only">
          {t("passwordHelp")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label={t("ariaForm")}>
          {/* Nom */}
          <div className="space-y-1">
            <label htmlFor="lastName" className="text-sm font-medium">
              {t("lastName")}
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder={t("lastNamePh")}
              className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-300"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              aria-describedby="register-error"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t("emailPh")}
              className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-describedby="register-error"
            />
          </div>

          {/* Mot de passe */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              {t("password")}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("passwordPh")}
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-300 pr-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-describedby="register-error password-help"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800 px-2 py-1"
                aria-label={showPwd ? t("hidePwd") : t("showPwd")}
              >
                {showPwd ? t("hide") : t("show")}
              </button>
            </div>
          </div>

          {/* Confirmation */}
          <div className="space-y-1">
            <label htmlFor="confirm" className="text-sm font-medium">
              {t("confirmPwd")}
            </label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirmPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder={t("confirmPwdPh")}
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-300 pr-14"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                aria-describedby="register-error password-help"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPwd((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800 px-2 py-1"
                aria-label={showConfirmPwd ? t("hidePwd") : t("showPwd")}
              >
                {showConfirmPwd ? t("hide") : t("show")}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-900 text-white py-2 rounded-md hover:bg-red-800 disabled:opacity-60"
          >
            {loading ? t("creatingBtn") : t("submit")}
          </button>

          {/* Lien login */}
          <p className="text-sm mt-2 text-center">
            {t("already")}{" "}
            <Link href={`/${locale}/login`} className="text-red-700 hover:underline">
              {t("login")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
