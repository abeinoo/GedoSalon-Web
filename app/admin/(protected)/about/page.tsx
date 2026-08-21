import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import AboutForm from "@/components/admin/AboutForm";

export default async function AdminAboutPage() {
  await verifySession();
  const about = await prisma.aboutContent.findUnique({ where: { id: "main" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">About Us</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage the About Us section shown on the public homepage.</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <AboutForm about={about} />
      </div>
    </div>
  );
}
