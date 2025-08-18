import type { Metadata } from "next";
import MeClient from "@/components/account/Profile";

type Params = { locale: "fr" | "en" | "nl" };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "fr" ? "Mon profil – Minao" :
      locale === "nl" ? "Mijn profiel – Minao" :
      "My profile – Minao",
    alternates: { canonical: `/${locale}/profile` },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale } = await params; // ✅
  return <MeClient locale={locale} />;
}
