import MeClient from "@/components/account/MeClient";

export default function Page({ params }: { params: { locale: string } }) {
  return <MeClient locale={params.locale} />;
}
