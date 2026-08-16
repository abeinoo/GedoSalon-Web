"use client";

import { useRef } from "react";
import Image from "next/image";
import { siteContent } from "@/lib/content";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export default function Barbers() {
  const { barbers } = siteContent;
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  return (
    <section id="barbers" className="bg-neutral-200/60 py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <h2 className="text-center text-2xl font-bold tracking-wide text-neutral-900 sm:text-3xl">
          {barbers.title}
          <span className="mx-auto mt-3 block h-0.5 w-10 bg-neutral-900" />
        </h2>

        <div className="relative mt-12">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 z-10 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-400 bg-white p-2.5 text-neutral-700 shadow-sm transition hover:bg-neutral-900 hover:text-white sm:flex"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {barbers.items.map((barber) => (
              <div
                key={barber.name}
                className="group relative aspect-[4/5] w-[45%] shrink-0 overflow-hidden sm:w-[28%] lg:w-[16%]"
              >
                <Image
                  src={barber.image}
                  alt={barber.name}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 28vw, 45vw"
                  className="object-cover grayscale transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-3 text-center">
                  <p className="text-sm font-bold tracking-wide text-white">{barber.name}</p>
                  <p className="text-[10px] tracking-wide text-white/70">{barber.title}</p>
                  <a
                    href={barber.bookHref}
                    className="mt-1 w-full rounded-sm bg-white/15 px-2 py-1.5 text-[10px] font-medium tracking-widest text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
                  >
                    BOOK WITH HIM
                  </a>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-neutral-400 bg-white p-2.5 text-neutral-700 shadow-sm transition hover:bg-neutral-900 hover:text-white sm:flex"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={barbers.viewAllHref}
            className="rounded-full border border-neutral-400 px-6 py-2.5 text-xs font-medium tracking-widest text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            {barbers.viewAllLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
