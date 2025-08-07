'use client';

import CardDishes from "./CardDishes";
import dishes from "./dishesData.json";

export default function CardContainer() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Nos spécialités
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dishes.map((dish) => (
            <CardDishes
              key={dish.id}
              title={dish.title}
              image={dish.image}
              tags={dish.tags}
              description={dish.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
