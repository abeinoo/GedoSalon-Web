import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import OpeningHoursForm from "@/components/admin/OpeningHoursForm";

export default async function EditOpeningHoursPage({ params }: { params: Promise<{ id: string }> }) {
  await verifySession();
  const { id } = await params;
  const openingHours = await prisma.openingHours.findUnique({ where: { id } });

  if (!openingHours) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Hours Row</h1>
      </div>
      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <OpeningHoursForm openingHours={openingHours} />
      </div>
    </div>
  );
}
