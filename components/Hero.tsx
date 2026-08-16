import Image from "next/image";
import { siteContent } from "@/lib/content";
import { ArrowRightIcon } from "./icons";

export default function Hero() {
  const { hero } = siteContent;

  return (
    <section id="home" className="relative flex h-[68vh] min-h-[500px] w-full items-center overflow-hidden bg-black">
      <Image
        src={hero.image}
        alt="Gedo Salon interior"
        fill
        priority
        className="object-cover object-left"
      />
      {/* Left-weighted scrim — darkest behind the text, fading toward the
          center/right so the salon interior and backlit logo stay visible. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.50) 35%, rgba(0,0,0,0.20) 65%, rgba(0,0,0,0.10) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <p
          className="text-xs font-medium tracking-[0.3em] text-white/80"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
        >
          {hero.label}
        </p>
        <h1
          className="mt-4 font-sans text-6xl font-bold leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl"
          style={{ textShadow: "0 4px 24px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.6)" }}
        >
          {hero.headingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p
          className="mt-5 text-base text-white/85 sm:text-lg"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
        >
          {hero.subtitle}
        </p>

        <a
          href={hero.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/70 px-7 py-3.5 text-xs font-medium tracking-widest text-white transition hover:bg-white hover:text-black"
        >
          {hero.ctaLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
