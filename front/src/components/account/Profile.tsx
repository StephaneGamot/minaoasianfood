// src/components/Profile/ProfileClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type Profile = {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phoneNumber?: string | null;
  address?: string | null;
  address2?: string | null;
  city?: string | null;
  postalCode?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  profilePicUrl?: string | null;
  role?: "USER" | "ADMIN" | "DASHBOARD" | "GUEST";
  active?: boolean;
  createdAt?: string;   // ISO
  updatedAt?: string;   // ISO
};

type Props = { locale: string };

const API = process.env.NEXT_PUBLIC_API_BASE || "/api";

export default function ProfileClient({ locale }: Props) {
  const t = useTranslations("profile");
  const intlLocale = useLocale();
  const router = useRouter();
  const { authedFetch, logout } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyLogout, setBusyLogout] = useState(false);
  const [error, setError] = useState<string>("");

  // Charge le profil (source de vérité) et ne redirige que si 401
  async function loadProfile() {
    setLoading(true);
    setError("");
    try {
      const res = await authedFetch(`${API}/auth/me`, { cache: "no-store" });
      if (res.status === 401) {
        router.replace(`/${locale}/login?redirectTo=/${locale}/profile`);
        return;
      }
      if (!res.ok) {
        const text = await res.text();
        setError(text || "Unable to load profile");
        return;
      }
      const data = (await res.json()) as Profile;
      setProfile(data);
    } catch {
      setError(t("loadError", { default: "Impossible de charger votre profil." }) as string);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]); // re-charge si on change de langue

  const displayName = useMemo(() => {
    const fn = profile?.firstName?.trim() || "";
    const ln = profile?.lastName?.trim() || "";
    const name = `${fn} ${ln}`.trim();
    return name || profile?.email || "User";
  }, [profile]);

  const initial = (displayName || "?").charAt(0).toUpperCase();

  const created = profile?.createdAt
    ? new Intl.DateTimeFormat(intlLocale, { dateStyle: "long" }).format(new Date(profile.createdAt))
    : null;

  const updated = profile?.updatedAt
    ? new Intl.DateTimeFormat(intlLocale, { dateStyle: "medium" }).format(new Date(profile.updatedAt))
    : null;

  async function handleLogout() {
    setBusyLogout(true);
    try {
      await logout();
    } finally {
      setBusyLogout(false);
      router.push(`/${locale}/login`);
    }
  }

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        {/* Skeleton */}
        <div className="rounded-3xl overflow-hidden shadow-sm border bg-gradient-to-br from-red-900 via-red-800 to-red-600 h-40" />
        <div className="-mt-10 mx-4 md:mx-6 bg-white rounded-2xl shadow-sm border p-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-5 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-72 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="h-28 bg-gray-100 rounded" />
              <div className="h-28 bg-gray-100 rounded" />
              <div className="h-28 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-red-700 text-sm">{error}</p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => loadProfile()}
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
            >
              {t("retry", { default: "Réessayer" })}
            </button>
            <Link
              href={`/${locale}/`}
              className="inline-flex items-center rounded-md px-4 py-2 text-sm text-red-900 hover:underline"
            >
              ← {t("backHome", { default: "Retour à l’accueil" })}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ----- Page profil -----
  return (
    <main className="max-w-5xl mx-auto p-6">
      {/* Hero */}
      <div className="rounded-3xl overflow-hidden shadow-sm border bg-gradient-to-br from-red-900 via-red-800 to-red-600 p-6 relative">
        {/* Avatar */}
        <div className="absolute left-6 -bottom-10">
          {profile?.profilePicUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profilePicUrl}
              alt={displayName}
              className="h-20 w-20 rounded-full ring-4 ring-white object-cover"
            />
          ) : (
            <div className="h-20 w-20 rounded-full ring-4 ring-white bg-white/10 text-white flex items-center justify-center text-2xl font-semibold">
              {initial}
            </div>
          )}
        </div>

        <div className="text-white">
          <h1 className="text-2xl md:text-3xl font-semibold">{t("title", { default: "Mon profil" })}</h1>
          <p className="opacity-90">{t("subtitle", { default: "Gérez vos informations personnelles" })}</p>
        </div>
      </div>

      {/* Card principale */}
      <section className="-mt-10 bg-white rounded-2xl shadow-sm border p-6 md:p-8">
        {/* Header identité */}
        <div className="md:pl-24">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">{displayName}</h2>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile?.role && (
                <span className="inline-flex items-center rounded-full bg-red-50 text-red-900 border border-red-100 px-3 py-1 text-xs font-medium">
                  {profile.role}
                </span>
              )}
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border
                ${profile?.active ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-gray-100 text-gray-700 border-gray-200"}`}
              >
                {profile?.active ? t("active", { default: "Actif" }) : t("inactive", { default: "Inactif" })}
              </span>
            </div>
          </div>

          {/* Méta */}
          <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-3">
            {created && <span>{t("memberSince", { default: "Membre depuis" })}: {created}</span>}
            {updated && <span>• {t("updated", { default: "Modifié" })}: {updated}</span>}
          </div>
        </div>

        {/* Grille infos */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coordonnées */}
          <div className="col-span-1 md:col-span-2 rounded-xl border p-5">
            <h3 className="font-medium mb-4">{t("contact", { default: "Coordonnées" })}</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <div>
                <dt className="text-gray-500">{t("firstName", { default: "Prénom" })}</dt>
                <dd className="font-medium">{profile?.firstName || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{t("lastName", { default: "Nom" })}</dt>
                <dd className="font-medium">{profile?.lastName || "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-gray-500">{t("email", { default: "E-mail" })}</dt>
                <dd className="font-medium break-all">{profile?.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{t("phone", { default: "Téléphone" })}</dt>
                <dd className="font-medium">{profile?.phoneNumber || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{t("gender", { default: "Genre" })}</dt>
                <dd className="font-medium">{profile?.gender || "—"}</dd>
              </div>
            </dl>
          </div>

          {/* Actions rapides */}
          <div className="col-span-1 rounded-xl border p-5">
            <h3 className="font-medium mb-4">{t("quickActions", { default: "Actions rapides" })}</h3>
            <div className="space-y-2">
              <Link
                href={`/${locale}/profile/settings`}
                className="w-full inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
              >
                {t("editProfile", { default: "Éditer le profil" })}
              </Link>
              <Link
                href={`/${locale}/settings/security`}
                className="w-full inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
              >
                {t("security", { default: "Sécurité & mot de passe" })}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={busyLogout}
                className="w-full inline-flex items-center justify-center rounded-md bg-red-900 text-white px-3 py-2 text-sm hover:bg-red-800 disabled:opacity-60"
              >
                {t("logout", { default: "Se déconnecter" })}
              </button>
              <button
                type="button"
                onClick={() => loadProfile()}
                className="w-full inline-flex items-center justify-center rounded-md px-3 py-2 text-sm border hover:bg-gray-50"
              >
                {t("refresh", { default: "Rafraîchir les infos" })}
              </button>
            </div>
          </div>

          {/* Adresse */}
          <div className="col-span-1 md:col-span-3 rounded-xl border p-5">
            <h3 className="font-medium mb-4">{t("address", { default: "Adresse" })}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500">{t("address1", { default: "Adresse" })}</div>
                <div className="font-medium">{profile?.address || "—"}</div>
              </div>
              <div>
                <div className="text-gray-500">{t("city", { default: "Ville" })}</div>
                <div className="font-medium">{profile?.city || "—"}</div>
              </div>
              <div>
                <div className="text-gray-500">{t("postalCode", { default: "Code postal" })}</div>
                <div className="font-medium">{profile?.postalCode || "—"}</div>
              </div>
            </div>
            {profile?.address2 && (
              <div className="text-sm mt-2">
                <span className="text-gray-500">{t("address2", { default: "Complément" })}:</span>{" "}
                <span className="font-medium">{profile.address2}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
