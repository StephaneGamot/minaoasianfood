// src/app/[locale]/profile/settings/page.tsx
import ProfileSettingsForm from "@/components/account/ProfileSettingsForm";

export default function Page({
  params,
  searchParams
}: {
  params: { locale: string };
  searchParams: { redirectTo?: string };
}) {
  return <ProfileSettingsForm locale={params.locale} />;
}
