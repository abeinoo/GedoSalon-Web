import Image from "next/image";
import { siteContent } from "@/lib/content";
import { getActiveBranches } from "@/lib/public-content";
import { PinIcon } from "./icons";

export default async function Branches() {
  const { branches } = siteContent;
  const items = await getActiveBranches();

  if (items.length === 0) return null;

  const duration = Math.max(items.length * 4, 20);

  return (
    <section id="branches" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <h2 className="text-center text-2xl font-bold tracking-wide text-neutral-900 sm:text-3xl">
          {branches.title}
          <span className="mx-auto mt-3 block h-0.5 w-10 bg-neutral-900" />
        </h2>

        <div className="marquee-viewport mt-12" data-animate="true">
          <div
            className="marquee-track gap-4"
            data-animate="true"
            style={{ ["--marquee-duration" as string]: `${duration}s` }}
          >
            {[items, items].map((set, setIndex) =>
              set.map((branch) => (
                <div
                  key={`${setIndex}-${branch.id}`}
                  aria-hidden={setIndex === 1}
                  className={`group relative aspect-[4/3] w-[62cqw] shrink-0 overflow-hidden sm:w-[42cqw] lg:w-[23cqw] ${
                    setIndex === 1 ? "marquee-duplicate" : ""
                  }`}
                >
                  <Image
                    src={branch.image}
                    alt={branch.name}
                    fill
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 42vw, 62vw"
                    className="object-cover grayscale transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/45 transition group-hover:bg-black/55" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-sm font-bold tracking-wide text-white">{branch.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-white/75">
                      <PinIcon className="h-3.5 w-3.5" />
                      {branch.location}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
