import Image from "next/image";
import { siteContent } from "@/lib/content";
import { PinIcon } from "./icons";

export default function Branches() {
  const { branches } = siteContent;

  return (
    <section id="branches" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <h2 className="text-center text-2xl font-bold tracking-wide text-neutral-900 sm:text-3xl">
          {branches.title}
          <span className="mx-auto mt-3 block h-0.5 w-10 bg-neutral-900" />
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {branches.items.map((branch) => (
            <div key={branch.name} className="group relative aspect-[4/3] overflow-hidden">
              <Image
                src={branch.image}
                alt={branch.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
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
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href={branches.viewAllHref}
            className="rounded-full border border-neutral-400 px-6 py-2.5 text-xs font-medium tracking-widest text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            {branches.viewAllLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
