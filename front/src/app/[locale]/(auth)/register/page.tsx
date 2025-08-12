import RegisterForm from "@/components/Auth/RegisterForm";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams; // Next 15: on "await" searchParams
  // Après inscription, tu peux choisir de rediriger vers /login si tu ne fais pas d'auto-login :
  // return <RegisterForm redirectTo={redirectTo ?? "/login"} />;
  return <RegisterForm redirectTo={redirectTo ?? "/dashboard"} />;
}
