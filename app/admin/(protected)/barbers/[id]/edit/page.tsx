import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import BarberForm from "@/components/admin/BarberForm";

export default async function EditBarberPage({ params }: { params: Promise<{ id: string }> }) {
  await verifySession();
  const { id } = await params;
  const barber = await prisma.barber.findUnique({ where: { id } });

  if (!barber) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Barber</h1>
        <p className="mt-1 text-sm text-neutral-500">{barber.name}</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <BarberForm barber={barber} />
      </div>
    </div>
  );
}
