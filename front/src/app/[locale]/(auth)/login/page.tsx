import LoginForm from "@/components/Auth/LoginForm";

export default async function Page({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { locale } = params;
  const { redirectTo } = await searchParams;

  const target =
    redirectTo
      ? redirectTo.startsWith("http")
        ? redirectTo
        : redirectTo.startsWith(`/${locale}/`) || redirectTo === `/${locale}`
          ? redirectTo
          : `/${locale}${redirectTo.startsWith("/") ? "" : "/"}${redirectTo}`
      : `/${locale}/menu`; // défaut par langue

  return <LoginForm redirectTo={target} />;
}
