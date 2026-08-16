import Image from "next/image";
import { siteContent } from "@/lib/content";

export default function Gallery() {
  const { gallery } = siteContent;

  return (
    <section id="gallery" className="bg-neutral-100 py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <h2 className="text-center text-2xl font-bold tracking-wide text-neutral-900 sm:text-3xl">
          {gallery.title}
          <span className="mx-auto mt-3 block h-0.5 w-10 bg-neutral-900" />
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {gallery.images.map((src, i) => (
            <div key={src} className="group relative aspect-square overflow-hidden">
              <Image
                src={src}
                alt={`Gedo Salon haircut style ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover grayscale transition duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href={gallery.viewAllHref}
            className="rounded-full border border-neutral-400 px-6 py-2.5 text-xs font-medium tracking-widest text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            {gallery.viewAllLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
