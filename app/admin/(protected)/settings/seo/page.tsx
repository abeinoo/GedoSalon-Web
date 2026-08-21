import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import SeoSettingsForm from "@/components/admin/SeoSettingsForm";

export default async function AdminSeoSettingsPage() {
  await verifySession();
  const seoSettings = await prisma.seoSettings.findUnique({ where: { id: "main" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">SEO Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Controls the homepage&apos;s page title, meta description, and social share preview.</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <SeoSettingsForm seoSettings={seoSettings} />
      </div>
    </div>
  );
}
