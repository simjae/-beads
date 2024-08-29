import { ImageSlider } from "./ImageSlider";

export function BeadsArtSection({ images }: { images: string[] }) {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center">
        {/* Beads Art Text */}
        <div className="flex-1 mb-8 lg:mb-0 lg:mr-8 text-center lg:text-left">
          <h2 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl md:text-6xl lg:text-7xl">
            Beads Art
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Explore the beauty and creativity of bead art.
          </p>
        </div>

        {/* Image Slider */}
        <div className="flex-1">
          <ImageSlider images={images} />
        </div>
      </div>
    </section>
  );
}
