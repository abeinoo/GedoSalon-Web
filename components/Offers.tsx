import Image from "next/image";
import { siteContent, bookingHref } from "@/lib/content";
import { getActiveOffers } from "@/lib/public-content";

export default async function Offers() {
  const { offers } = siteContent;
  const items = await getActiveOffers();

  if (items.length === 0) return null;

  return (
    <section id="offers" className="bg-neutral-950 py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <p className="text-center text-xs font-medium tracking-[0.3em] text-white/60">{offers.label}</p>
        <h2 className="mt-4 text-center text-3xl font-bold tracking-wide text-white sm:text-4xl">
          {offers.title}
          <span className="mx-auto mt-3 block h-0.5 w-10 bg-white" />
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-center text-sm text-white/65 sm:text-base">{offers.subtitle}</p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((offer) => (
            <div
              key={offer.id}
              className="group flex flex-col border border-white/10 bg-neutral-900/60 transition duration-300 hover:-translate-y-1 hover:border-white/30"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute right-4 top-4 bg-white px-3 py-1 text-xs font-bold tracking-widest text-black">
                  {offer.discount}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold tracking-wide text-white">{offer.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">{offer.description}</p>
                <a
                  href={bookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-fit items-center rounded-full border border-white/70 px-6 py-2.5 text-xs font-medium tracking-widest text-white transition hover:bg-white hover:text-black"
                >
                  CLAIM OFFER
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
