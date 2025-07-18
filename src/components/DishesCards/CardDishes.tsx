import Image from "next/image";
import { tagStyles } from "./tagStyles";

type Props = {
  title: string;
  image: string;
  tags?: string[];
  description: string;
};

export default function CardDishes({ title, image, tags = [], description }: Props) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg w-full">
      <div className="relative h-52 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>

        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, i) => {
              const style = tagStyles[tag] || {
                color: "bg-gray-200 text-gray-800",
                icon: "🔖",
              };

              return (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${style.color}`}
                >
                  <span>{style.icon}</span>
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        <p className="mt-4 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
