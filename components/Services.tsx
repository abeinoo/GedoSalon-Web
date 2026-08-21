import { siteContent } from "@/lib/content";
import { serviceIconMap } from "./icons";

// Pure-display category strip — deliberately NOT driven by the CMS
// `Service` model (which still exists, is fully manageable in
// /admin/services, and can be used elsewhere later). This section shows a
// fixed set of service-category icons + labels only: no photos, no price,
// no description, no card, and no interaction on individual items.
export default function Services() {
  const { services } = siteContent;

  return (
    <section id="services" className="bg-neutral-100 py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <h2 className="text-center text-2xl font-bold tracking-wide text-neutral-900 sm:text-3xl">
          {services.title}
          <span className="mx-auto mt-3 block h-0.5 w-10 bg-neutral-900" />
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {services.items.map((item) => {
            const Icon = serviceIconMap[item.icon];
            return (
              <div key={item.title} className="flex cursor-default flex-col items-center gap-3 text-center">
                <Icon className="h-9 w-9 text-neutral-700" />
                <span className="text-xs font-semibold tracking-widest text-neutral-800">{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
