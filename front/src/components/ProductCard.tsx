import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

export type Product = {
  id: number | string;
  name: string;
  priceNumber: number | string;
  price?: string;
  imageSrc: string;
};

type Props = { p: Product; className?: string };

function formatEur(amount: number, locale = "fr-BE") {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(amount);
}

export default function ProductCard({ p, className }: Props) {
  const id = Number(p.id);
  const priceNumber = Math.max(0, Number(p.priceNumber) || 0);
  const displayPrice = p.price ?? formatEur(priceNumber);

  return (
    <div className={`rounded-lg border p-3 ${className ?? ""}`}>
      <div className="relative mb-3 h-40 w-full overflow-hidden rounded-md">
        <Image
          src={p.imageSrc}
          alt={p.name}
          fill
          className="object-cover"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
        />
      </div>

      <h3 className="font-medium">{p.name}</h3>
      <p className="text-sm text-gray-600">{displayPrice}</p>

      <div className="mt-3">
        <AddToCartButton
          item={{
            id,
            name: p.name,
            priceNumber,
            price: displayPrice,
            imageSrc: p.imageSrc,
            quantity: 1,
          }}
        />
      </div>
    </div>
  );
}
