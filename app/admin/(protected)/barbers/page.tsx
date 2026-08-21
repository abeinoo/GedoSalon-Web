import Link from "next/link";
import Image from "next/image";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import BarberRowActions from "@/components/admin/BarberRowActions";

export default async function AdminBarbersPage() {
  await verifySession();
  const barbers = await prisma.barber.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Barbers</h1>
          <p className="mt-1 text-sm text-neutral-500">{barbers.length} total</p>
        </div>
        <Link
          href="/admin/barbers/new"
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800"
        >
          + ADD BARBER
        </Link>
      </div>

      {barbers.length === 0 ? (
        <EmptyState
          title="No barbers yet"
          description="Add your first team member so they can appear on the public homepage."
          actionLabel="Add Barber"
          actionHref="/admin/barbers/new"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs tracking-widest text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-medium">BARBER</th>
                <th className="px-5 py-3 font-medium">TITLE</th>
                <th className="px-5 py-3 font-medium">ORDER</th>
                <th className="px-5 py-3 font-medium">STATUS</th>
                <th className="px-5 py-3 font-medium text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {barbers.map((barber) => (
                <tr key={barber.id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                        <Image src={barber.image} alt={barber.name} fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="font-medium text-neutral-900">{barber.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{barber.title}</td>
                  <td className="px-5 py-3 text-neutral-600">{barber.displayOrder}</td>
                  <td className="px-5 py-3">
                    <StatusBadge active={barber.isActive} />
                  </td>
                  <td className="px-5 py-3">
                    <BarberRowActions id={barber.id} name={barber.name} isActive={barber.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
