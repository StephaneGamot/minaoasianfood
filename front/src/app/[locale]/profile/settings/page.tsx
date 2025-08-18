// src/app/[locale]/profile/settings/page.tsx
import type { Metadata } from "next";
import ProfileSettingsForm from "@/components/account/ProfileSettingsForm";

type Params = { locale: "fr" | "en" | "nl" };
//type Search = { redirectTo?: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "fr" ? "Paramètres du profil – Minao" :
      locale === "nl" ? "Profielinstellingen – Minao" :
      "Profile settings – Minao",
    alternates: { canonical: `/${locale}/profile/settings` },
  };
}

export default async function Page({
  params,
  // si tu en as besoin plus tard :
  // searchParams,
}: {
  params: Promise<Params>;
  // searchParams?: Promise<Search>;
}) {
  const { locale } = await params; // ✅ important
  return <ProfileSettingsForm locale={locale} />;
}
