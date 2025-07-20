import ResponsiveImage from "@/components/Gallery/ResponsiveImage";
import Restaurant1 from "./../../../../public/images/restaurant1.jpg"
import Restaurant2 from "./../../../../public/images/restaurant2.jpg"
import { StaticImageData } from "next/image";

type ResponsiveImageProps = {
  src: string | StaticImageData; // <-- ici
  alt: string;
  rounded?: boolean;
  priority?: boolean;
  className?: string;
};


export default function Page() {
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <ResponsiveImage
        src={Restaurant1}
        alt="Bœuf savoureux"
        size="lg"
      />
      <ResponsiveImage
       src={Restaurant2}
        alt="Tiramisu crémeux"
        size="md"
        rounded={false}
      />
    </div>
  );
}
