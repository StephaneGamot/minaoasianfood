import MeClient from "@/components/account/Profile";

export default function Page({ params }: { params: { locale: string } }) {
  return <MeClient locale={params.locale} />;
}
