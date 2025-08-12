// Server Component (par défaut). On attend searchParams (Next 15).
import LoginForm from "@/components/Auth/LoginForm";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams; // ✅ on "await" pour éviter le warning Next
  return <LoginForm redirectTo={redirectTo ?? "/dashboard"} />;
}
