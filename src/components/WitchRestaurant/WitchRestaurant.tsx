"use client";

import Image from "next/image";
import Link from "next/link";
import restaurant1 from "./../../../public/images/restaurant1.jpg";
import restaurant2 from "./../../../public/images/restaurant2.jpg";

const restaurants = [
  {
    id: 1,
    name: "Minao Schaerbeek",
    city: "Schaerbeek",
    image: restaurant1,
    address: "Rue Général Eenens 20, 1030 Schaerbeek",
    phone: "+32 472 123 456",
    hours: "Tous les jours • 11h30–22h",
    badge: "Schaerbeek",
    mapsLink: "https://goo.gl/maps/example1",
  },
  {
    id: 2,
    name: "Minao Dilbeek",
    city: "Dilbeek",
    image: restaurant2,
    address: "Ninoofsesteenweg 170, 1700 Dilbeek",
    phone: "+32 472 789 012",
    hours: "Tous les jours • 12h–22h",
    badge: "Dilbeek",
    mapsLink: "https://goo.gl/maps/example2",
  },
];

export default function WitchRestaurant() {
  return (
    <section className="bg-white py-16 px-4 lg:px-12">
      <div className="mx-auto max-w-7xl text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Nos restaurants</h2>
        <p className="mt-2 text-gray-600">
          Retrouvez-nous à Bruxelles et Dilbeek pour une expérience asiatique
          inoubliable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto place-items-center">
        {restaurants.map((resto) => (
          <div
            key={resto.id}
            className="overflow-hidden rounded-xl shadow-lg transition hover:shadow-xl max-w-[500px] w-full"
          >
            <div className="relative w-full aspect-[3/2]">
              <Image
                src={resto.image}
                alt={resto.name}
                fill
                className="object-cover"
                priority
              />
              <span className="absolute top-3 left-3 bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                {resto.badge}
              </span>
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-xl font-bold text-gray-900">{resto.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{resto.address}</p>
              <p className="text-sm text-gray-600">{resto.hours}</p>
              <p className="text-sm text-gray-600 mt-1">📞 {resto.phone}</p>
              <div className="mt-4">
                <Link
                  href={resto.mapsLink}
                  target="_blank"
                  className="inline-block text-red-800 font-medium hover:underline"
                >
                  📍 Voir sur la carte
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
