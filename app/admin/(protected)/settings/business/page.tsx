import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import BusinessInfoForm from "@/components/admin/BusinessInfoForm";

export default async function AdminBusinessInfoPage() {
  await verifySession();
  const businessInfo = await prisma.businessInfo.findUnique({ where: { id: "main" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Business Information</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Legal name, address, and contact facts — shown in the About and Footer sections for business verification.
        </p>
      </div>

      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <BusinessInfoForm businessInfo={businessInfo} />
      </div>
    </div>
  );
}
