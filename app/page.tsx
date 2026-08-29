import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Offers from "@/components/Offers";
import About from "@/components/About";
import Barbers from "@/components/Barbers";
import Branches from "@/components/Branches";
import Features from "@/components/Features";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import { getActiveBarbers, getSeoSettings } from "@/lib/public-content";

// This page is statically generated and normally kept fresh by
// revalidatePath("/") in every admin Server Action — but a brand-new
// production deploy is built (and its static "/" prerendered) before the
// database is migrated/seeded, so the very first request would otherwise
// keep serving that empty build-time snapshot until an admin explicitly
// saves something. This time-based revalidation is a safety net for that
// specific gap (confirmed live against an actual Docker deploy), on top of
// the immediate on-demand revalidation admin edits already trigger.
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  if (!seo) return {};

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords ?? undefined,
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

export default async function Home() {
  const barbers = await getActiveBarbers();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Branches />
        <Offers />
        <Gallery />
        <Barbers items={barbers} />
        <About />
        <Features />
      </main>
      <Footer />
    </>
  );
}
