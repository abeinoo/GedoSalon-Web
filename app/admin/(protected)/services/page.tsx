import Link from "next/link";
import Image from "next/image";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import ServiceRowActions from "@/components/admin/ServiceRowActions";

export default async function AdminServicesPage() {
  await verifySession();
  const services = await prisma.service.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Services</h1>
          <p className="mt-1 text-sm text-neutral-500">{services.length} total</p>
        </div>
        <Link
          href="/admin/services/new"
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800"
        >
          + ADD SERVICE
        </Link>
      </div>

      {services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Add your first service so it can appear on the public homepage."
          actionLabel="Add Service"
          actionHref="/admin/services/new"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs tracking-widest text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-medium">SERVICE</th>
                <th className="px-5 py-3 font-medium">CATEGORY</th>
                <th className="px-5 py-3 font-medium">PRICE</th>
                <th className="px-5 py-3 font-medium">ORDER</th>
                <th className="px-5 py-3 font-medium">STATUS</th>
                <th className="px-5 py-3 font-medium text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                        <Image src={service.image} alt={service.name} fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="font-medium text-neutral-900">{service.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{service.category}</td>
                  <td className="px-5 py-3 text-neutral-600">{service.price.toLocaleString()} EGP</td>
                  <td className="px-5 py-3 text-neutral-600">{service.displayOrder}</td>
                  <td className="px-5 py-3">
                    <StatusBadge active={service.isActive} />
                  </td>
                  <td className="px-5 py-3">
                    <ServiceRowActions id={service.id} name={service.name} isActive={service.isActive} />
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
