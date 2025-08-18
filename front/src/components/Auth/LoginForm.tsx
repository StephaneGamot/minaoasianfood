"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslations, useLocale } from "next-intl";

type LoginFormProps = {
  redirectTo?: string; // ex: "/fr/dashboard"
  onSubmit?: (email: string, password: string) => Promise<boolean>;
};

export default function LoginForm({
  redirectTo,
  onSubmit,
}: LoginFormProps) {
  const t = useTranslations("loginForm");
  const locale = useLocale();
  const router = useRouter();
  const { login: ctxLogin } = useAuth();
  const login = onSubmit ?? ctxLogin;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Si aucune prop, on redirige vers /{locale}/dashboard
  const finalRedirect = redirectTo ?? `/${locale}/menu`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("fillAll"));
      return;
    }
    if (!login) {
      setError(t("unavailableAuth"));
      return;
    }

    try {
      setLoading(true);
      const ok = await login(email, password);
      if (!ok) {
        setError(t("invalid")); // 400/401 -> identifiants invalides
        return;
      }
      router.push(finalRedirect);
    } catch (err) {
      console.error(err);
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-center mb-6">{t("title")}</h1>

        <p id="form-status" role="status" aria-live="polite" className="sr-only">
          {loading ? t("creating") : ""}
        </p>

        <div
          id="form-error"
          role="alert"
          aria-live="assertive"
          className={error ? "mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" : "sr-only"}
        >
          {error}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label={t("ariaForm")}>
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
              aria-required="true"
              aria-describedby="form-error"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              {t("password")}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                placeholder={t("passwordPh")}
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
                aria-label={showPwd ? t("hidePwd") : t("showPwd")}
              >
                {showPwd ? t("hide") : t("show")}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
              <span>{t("remember")}</span>
            </label>
            <Link href={`/${locale}/forgot-password`} className="text-red-700 hover:underline">
              {t("forgot")}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-900 text-white py-2 rounded-md hover:bg-red-800 disabled:opacity-60"
          >
            {loading ? t("creating") : t("submit")}
          </button>

          <p className="text-sm mt-2 text-center">
            {t("already")}{" "}
            <Link href={`/${locale}/register`} className="text-red-700 hover:underline">
              {t("register")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
