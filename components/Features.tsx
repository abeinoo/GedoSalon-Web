import { siteContent } from "@/lib/content";
import { featureIconMap } from "./icons";

export default function Features() {
  const { features } = siteContent;

  return (
    <section className="bg-neutral-600 py-12 sm:py-14">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12">
        {features.items.map((feature) => {
          const Icon = featureIconMap[feature.icon];
          return (
            <div key={feature.title} className="flex items-start gap-4">
              <Icon className="h-8 w-8 shrink-0 text-white" strokeWidth={1.2} />
              <div>
                <p className="text-sm font-bold tracking-wide text-white">{feature.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/75">{feature.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
