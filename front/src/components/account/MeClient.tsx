


"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslations, useLocale } from 'next-intl';

type Props = { locale: string };

// Petit type guard pour éviter `any`
type WithRole = { role?: string | string[] };
function hasRole(u: unknown): u is WithRole {
  return typeof u === "object" && u !== null && "role" in u;
}

export default function MeClient({ locale }: Props) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  // Pas d'isAuthenticated dans ton context -> on le dérive
  const isAuthed = !!user;

  useEffect(() => {
    if (!loading && !isAuthed) {
      router.replace(`/${locale}/login?redirectTo=/${locale}/me`);
    }
  }, [loading, isAuthed, router, locale]);

  if (loading || (!isAuthed && !user)) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </main>
    );
  }

  // Fallbacks sûrs
  const displayName = user?.name ?? "Utilisateur";
  const email = user?.email ?? "—";

  // ✅ Sans `any` : normalise role -> string[]
  const roles: string[] = hasRole(user)
    ? Array.isArray(user.role)
      ? user.role
      : user.role
      ? [user.role]
      : []
    : [];

  async function handleLogout() {
    try {
      await logout?.();
    } finally {
      router.push(`/${locale}/login`);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mon compte</h1>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-900 text-white text-xl font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold">{displayName}</p>
            <p className="text-sm text-gray-600">{email}</p>
          </div>
        </div>

        {roles.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {roles.map((r) => (
              <span key={r} className="rounded-full border px-3 py-1 text-xs bg-gray-50">
                {r}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/settings/profile`}
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Éditer le profil
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-md bg-red-900 px-4 py-2 text-sm text-white hover:bg-red-800"
          >
            Se déconnecter
          </button>

          <Link
            href={`/${locale}`}
            className="ml-auto inline-flex items-center justify-center rounded-md px-4 py-2 text-sm text-red-900 hover:underline"
          >
            ← Retour à l’accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
