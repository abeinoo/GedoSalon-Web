import Link from "next/link";
import { verifySession } from "@/lib/auth/dal";

const sections = [
  {
    title: "Business Information",
    description: "Legal business name, address, phone, and website — used for business verification.",
    href: "/admin/settings/business",
  },
  {
    title: "Footer",
    description: "Tagline, copyright, social links, and opening hours.",
    href: "/admin/settings/footer",
  },
  {
    title: "SEO",
    description: "Homepage meta title, description, keywords, and social share image.",
    href: "/admin/settings/seo",
  },
  {
    title: "Change Password",
    description: "Update your admin password. You'll be signed out and need to log in again.",
    href: "/admin/settings/password",
  },
];

export default async function AdminSettingsPage() {
  await verifySession();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Website Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Site-wide facts and presentation settings.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400"
          >
            <p className="text-sm font-bold text-neutral-900">{section.title}</p>
            <p className="mt-2 text-sm text-neutral-500">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
