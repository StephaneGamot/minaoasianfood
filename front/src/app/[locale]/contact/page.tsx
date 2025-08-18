import type { Metadata } from "next";
import ContactPageClient from "@/components/Contact/ContactPage";

type Locale = "fr" | "en" | "nl";
type Params = { locale: Locale };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } =
    (await import(`@/messages/${locale}/contact.json`)).default as {
      title: string; description: string;
    };

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/contact` },
    openGraph: { title, description, url: `/${locale}/contact`, type: "website" }
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const msgs = (await import(`@/messages/${locale}/contact.json`)).default as {
    title: string; description: string;
  };

  return (
    <main id="main" className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">{msgs.title}</h1>
      <p className="mt-2 text-gray-700">{msgs.description}</p>

      {/* 👉 composant client “comme le Footer” */}
      <ContactPageClient />
    </main>
  );
}
