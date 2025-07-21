import Gallery from "@/components/Gallery/Gallery";
import img1 from "./../../../../public/images/restaurant1.jpg";
import img2 from "./../../../../public/images/restaurant2.jpg";
import img3 from "./../../../../public/images/restaurant2.jpg";

export default function GalleryPage() {
  const images = [
    { src: img1, alt: "Salle du restaurant" },
    { src: img2, alt: "Tiramisu crémeux" },
    { src: img3, alt: "Bo bun" },
    // ajoute d’autres images ici
  ];

  return (
    <main aria-labelledby="gallery-heading" className="p-4">
      <h1 className="text-3xl text-center font-bold text-gray-900 mb-4">
        Gallerie de Photos
      </h1>
      <Gallery images={images} />
    </main>
  );
}
