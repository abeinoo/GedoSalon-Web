import Link from "next/link";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  await verifySession();

  const [
    serviceCount,
    offerCount,
    branchCount,
    barberCount,
    galleryCount,
    about,
    hero,
    businessInfo,
    footerSettings,
    seoSettings,
    recentServices,
    recentOffers,
    recentBranches,
    recentBarbers,
    recentGalleryImages,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.offer.count(),
    prisma.branch.count(),
    prisma.barber.count(),
    prisma.galleryImage.count(),
    prisma.aboutContent.findUnique({ where: { id: "main" } }),
    prisma.heroContent.findUnique({ where: { id: "hero" } }),
    prisma.businessInfo.findUnique({ where: { id: "main" } }),
    prisma.footerSettings.findUnique({ where: { id: "main" } }),
    prisma.seoSettings.findUnique({ where: { id: "main" } }),
    prisma.service.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, name: true, updatedAt: true } }),
    prisma.offer.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, title: true, updatedAt: true } }),
    prisma.branch.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, name: true, updatedAt: true } }),
    prisma.barber.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, name: true, updatedAt: true } }),
    prisma.galleryImage.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, updatedAt: true } }),
  ]);

  const stats = [
    { label: "Services", value: serviceCount, href: "/admin/services" },
    { label: "Offers", value: offerCount, href: "/admin/offers" },
    { label: "Barbers", value: barberCount, href: "/admin/barbers" },
    { label: "Branches", value: branchCount, href: "/admin/branches" },
    { label: "Gallery Images", value: galleryCount, href: "/admin/gallery" },
  ];

  const recentUpdates = [
    ...(about ? [{ id: "about", label: `About Us — ${about.title}`, updatedAt: about.updatedAt, href: "/admin/about" }] : []),
    ...(hero ? [{ id: "hero", label: `Homepage — ${hero.headingLine1} ${hero.headingLine2}`, updatedAt: hero.updatedAt, href: "/admin/hero" }] : []),
    ...(businessInfo
      ? [{ id: "business", label: `Business Info — ${businessInfo.legalName}`, updatedAt: businessInfo.updatedAt, href: "/admin/settings/business" }]
      : []),
    ...(footerSettings
      ? [{ id: "footer", label: "Footer settings", updatedAt: footerSettings.updatedAt, href: "/admin/settings/footer" }]
      : []),
    ...(seoSettings ? [{ id: "seo", label: `SEO — ${seoSettings.metaTitle}`, updatedAt: seoSettings.updatedAt, href: "/admin/settings/seo" }] : []),
    ...recentServices.map((s) => ({ id: s.id, label: `Service — ${s.name}`, updatedAt: s.updatedAt, href: `/admin/services/${s.id}/edit` })),
    ...recentOffers.map((o) => ({ id: o.id, label: `Offer — ${o.title}`, updatedAt: o.updatedAt, href: `/admin/offers/${o.id}/edit` })),
    ...recentBranches.map((b) => ({ id: b.id, label: `Branch — ${b.name}`, updatedAt: b.updatedAt, href: `/admin/branches/${b.id}/edit` })),
    ...recentBarbers.map((b) => ({ id: b.id, label: `Barber — ${b.name}`, updatedAt: b.updatedAt, href: `/admin/barbers/${b.id}/edit` })),
    ...recentGalleryImages.map((g) => ({ id: g.id, label: "Gallery image", updatedAt: g.updatedAt, href: `/admin/gallery/${g.id}/edit` })),
  ]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">Overview of your site content.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300">
              <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
              <p className="mt-1 text-xs font-medium tracking-widest text-neutral-500">{stat.label.toUpperCase()}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-bold tracking-widest text-neutral-900">QUICK ACTIONS</h2>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/admin/services/new"
              className="rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              + Add Service
            </Link>
            <Link
              href="/admin/offers/new"
              className="rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              + Add Offer
            </Link>
            <Link
              href="/admin/branches/new"
              className="rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              + Add Branch
            </Link>
            <Link
              href="/admin/barbers/new"
              className="rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              + Add Barber
            </Link>
            <Link
              href="/admin/gallery/new"
              className="rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              + Add Gallery Image
            </Link>
            <Link
              href="/admin/about"
              className="rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              Edit About Us
            </Link>
            <Link
              href="/admin/hero"
              className="rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              Edit Homepage
            </Link>
            <Link
              href="/admin/settings"
              className="rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              Website Settings
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-bold tracking-widest text-neutral-900">RECENT CONTENT UPDATES</h2>
          {recentUpdates.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">No content updates yet.</p>
          ) : (
            <ul className="mt-4 flex flex-col divide-y divide-neutral-100">
              {recentUpdates.map((update) => (
                <li key={`${update.id}-${update.label}`}>
                  <Link
                    href={update.href}
                    className="flex items-center justify-between gap-4 py-3 text-sm text-neutral-700 transition hover:text-neutral-900"
                  >
                    <span className="truncate">{update.label}</span>
                    <span className="shrink-0 text-xs text-neutral-400">
                      {update.updatedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
