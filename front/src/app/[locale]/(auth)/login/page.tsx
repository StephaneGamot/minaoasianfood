import type { Metadata } from "next";
import LoginForm from "@/components/Auth/LoginForm";

type Params = { locale: "fr" | "en" | "nl" };
type Search = { redirectTo?: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "fr" ? "Connexion" : locale === "nl" ? "Inloggen" : "Login" };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;              // ✅ attendre params
  const { redirectTo } = await searchParams;    // ✅ attendre searchParams

  const target =
    redirectTo
      ? redirectTo.startsWith("http")
        ? redirectTo
        : redirectTo.startsWith(`/${locale}/`) || redirectTo === `/${locale}`
          ? redirectTo
          : `/${locale}${redirectTo.startsWith("/") ? "" : "/"}${redirectTo}`
      : `/${locale}/menu`;

  return <LoginForm redirectTo={target} />;
}
