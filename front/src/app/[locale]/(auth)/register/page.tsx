import RegisterForm from "@/components/Auth/RegisterForm";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams; // Next 15: on "await" searchParams

  return <RegisterForm redirectTo={redirectTo ?? "/"} />;
}
