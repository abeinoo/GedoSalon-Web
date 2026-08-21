import Link from "next/link";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import FooterSettingsForm from "@/components/admin/FooterSettingsForm";
import StatusBadge from "@/components/admin/StatusBadge";
import SocialLinkRowActions from "@/components/admin/SocialLinkRowActions";
import OpeningHoursRowActions from "@/components/admin/OpeningHoursRowActions";
import EmptyState from "@/components/admin/EmptyState";

export default async function AdminFooterSettingsPage() {
  await verifySession();

  const [footerSettings, socialLinks, openingHours] = await Promise.all([
    prisma.footerSettings.findUnique({ where: { id: "main" } }),
    prisma.socialLink.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.openingHours.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Footer</h1>
        <p className="mt-1 text-sm text-neutral-500">Tagline, copyright, social links, and opening hours.</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <FooterSettingsForm footerSettings={footerSettings} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold tracking-tight text-neutral-900">Social Links</h2>
          <Link
            href="/admin/settings/footer/social/new"
            className="rounded-full bg-neutral-900 px-5 py-2 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800"
          >
            + ADD LINK
          </Link>
        </div>

        {socialLinks.length === 0 ? (
          <EmptyState title="No social links yet" description="Add a link so it appears in the footer." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs tracking-widest text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-medium">PLATFORM</th>
                  <th className="px-5 py-3 font-medium">LINK</th>
                  <th className="px-5 py-3 font-medium">ORDER</th>
                  <th className="px-5 py-3 font-medium">STATUS</th>
                  <th className="px-5 py-3 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {socialLinks.map((link) => (
                  <tr key={link.id}>
                    <td className="px-5 py-3 font-medium capitalize text-neutral-900">{link.platform}</td>
                    <td className="max-w-[240px] truncate px-5 py-3 text-neutral-600">{link.href}</td>
                    <td className="px-5 py-3 text-neutral-600">{link.displayOrder}</td>
                    <td className="px-5 py-3">
                      <StatusBadge active={link.isActive} />
                    </td>
                    <td className="px-5 py-3">
                      <SocialLinkRowActions id={link.id} platform={link.platform} isActive={link.isActive} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold tracking-tight text-neutral-900">Opening Hours</h2>
          <Link
            href="/admin/settings/footer/hours/new"
            className="rounded-full bg-neutral-900 px-5 py-2 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800"
          >
            + ADD ROW
          </Link>
        </div>

        {openingHours.length === 0 ? (
          <EmptyState title="No hours yet" description="Add a row so it appears in the footer." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs tracking-widest text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-medium">LABEL</th>
                  <th className="px-5 py-3 font-medium">HOURS</th>
                  <th className="px-5 py-3 font-medium">ORDER</th>
                  <th className="px-5 py-3 font-medium">STATUS</th>
                  <th className="px-5 py-3 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {openingHours.map((hours) => (
                  <tr key={hours.id}>
                    <td className="px-5 py-3 font-medium text-neutral-900">{hours.label}</td>
                    <td className="px-5 py-3 text-neutral-600">{hours.value}</td>
                    <td className="px-5 py-3 text-neutral-600">{hours.displayOrder}</td>
                    <td className="px-5 py-3">
                      <StatusBadge active={hours.isActive} />
                    </td>
                    <td className="px-5 py-3">
                      <OpeningHoursRowActions id={hours.id} label={hours.label} isActive={hours.isActive} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
