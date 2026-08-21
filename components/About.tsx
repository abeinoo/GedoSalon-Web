import Image from "next/image";
import { getActiveAbout, getBusinessInfo } from "@/lib/public-content";
import LocalizedLine from "./LocalizedLine";

export default async function About() {
  const [about, businessInfo] = await Promise.all([getActiveAbout(), getBusinessInfo()]);

  if (!about) return null;

  const paragraphs = [about.description, about.secondaryDescription];

  return (
    <section id="about" className="bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={about.image}
            alt="Inside Gedo Salon"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        <div>
          <p className="text-xs font-medium tracking-[0.3em] text-neutral-500">{about.label}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-wide text-neutral-900 sm:text-4xl">
            {about.title}
          </h2>
          <span className="mt-4 block h-0.5 w-10 bg-neutral-900" />

          <div className="mt-6 flex flex-col gap-4">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-neutral-600 sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>

          <a
            href={about.buttonUrl}
            className="mt-8 inline-flex w-fit items-center rounded-full border border-neutral-400 px-7 py-3 text-xs font-medium tracking-widest text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            {about.buttonText}
          </a>
        </div>
      </div>

      {businessInfo && (
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="mt-16 border-t border-neutral-200 pt-10 lg:mt-20 lg:pt-12">
            <p className="text-xs font-medium tracking-[0.3em] text-neutral-500">OFFICIAL BUSINESS INFORMATION</p>

            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-neutral-500">Legal Business Name</p>
                <LocalizedLine text={businessInfo.legalName} className="mt-2 text-sm font-medium text-neutral-900" />
              </div>

              <div>
                <p className="text-xs font-semibold tracking-widest text-neutral-500">Address</p>
                <div className="mt-2 flex flex-col gap-0.5">
                  {businessInfo.address.split("\n").map((line) => (
                    <LocalizedLine key={line} text={line} className="text-sm text-neutral-700" />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold tracking-widest text-neutral-500">Business Phone</p>
                <a
                  href={`tel:${businessInfo.phone.replace(/\s+/g, "")}`}
                  className="mt-2 block text-sm text-neutral-700 transition hover:text-neutral-900"
                >
                  {businessInfo.phone}
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold tracking-widest text-neutral-500">Website</p>
                <a
                  href={businessInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-neutral-700 transition hover:text-neutral-900"
                >
                  {businessInfo.website}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
