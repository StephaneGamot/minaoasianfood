// src/hooks/useProtectedRoute.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "next-intl";

export function useProtectedRoute(targetPathAfterLogin: string) {
  const { user, loading, ensureSession } = useAuth();
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (loading) return;
    (async () => {
      if (user) { setReady(true); return; }
      const ok = await ensureSession();
      if (ok) setReady(true);
      else router.replace(`/${locale}/login?redirectTo=${encodeURIComponent(targetPathAfterLogin)}`);
    })();
  }, [loading, user, ensureSession, router, locale, targetPathAfterLogin]);

  return { ready, user };
}
