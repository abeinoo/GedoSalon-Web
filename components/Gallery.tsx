import Image from "next/image";
import { siteContent } from "@/lib/content";
import { getActiveGalleryImages } from "@/lib/public-content";

export default async function Gallery() {
  const { gallery } = siteContent;
  const images = await getActiveGalleryImages();

  if (images.length === 0) return null;

  const duration = Math.max(images.length * 3, 18);

  return (
    <section id="gallery" className="bg-neutral-100 py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <h2 className="text-center text-2xl font-bold tracking-wide text-neutral-900 sm:text-3xl">
          {gallery.title}
          <span className="mx-auto mt-3 block h-0.5 w-10 bg-neutral-900" />
        </h2>

        <div className="marquee-viewport mt-12" data-animate="true">
          <div
            className="marquee-track gap-3"
            data-animate="true"
            style={{ ["--marquee-duration" as string]: `${duration}s` }}
          >
            {[images, images].map((set, setIndex) =>
              set.map((image, i) => (
                <div
                  key={`${setIndex}-${image.id}`}
                  aria-hidden={setIndex === 1}
                  className={`group relative aspect-square w-[42cqw] shrink-0 overflow-hidden sm:w-[28cqw] lg:w-[15cqw] ${
                    setIndex === 1 ? "marquee-duplicate" : ""
                  }`}
                >
                  <Image
                    src={image.image}
                    alt={`Gedo Salon haircut style ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 15vw, (min-width: 640px) 28vw, 42vw"
                    className="object-cover grayscale transition duration-500 group-hover:scale-105"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
