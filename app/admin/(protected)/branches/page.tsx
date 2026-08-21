import Link from "next/link";
import Image from "next/image";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import BranchRowActions from "@/components/admin/BranchRowActions";

export default async function AdminBranchesPage() {
  await verifySession();
  const branches = await prisma.branch.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Branches</h1>
          <p className="mt-1 text-sm text-neutral-500">{branches.length} total</p>
        </div>
        <Link
          href="/admin/branches/new"
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800"
        >
          + ADD BRANCH
        </Link>
      </div>

      {branches.length === 0 ? (
        <EmptyState
          title="No branches yet"
          description="Add your first branch so it can appear on the public homepage."
          actionLabel="Add Branch"
          actionHref="/admin/branches/new"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs tracking-widest text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-medium">BRANCH</th>
                <th className="px-5 py-3 font-medium">LOCATION</th>
                <th className="px-5 py-3 font-medium">ORDER</th>
                <th className="px-5 py-3 font-medium">STATUS</th>
                <th className="px-5 py-3 font-medium text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {branches.map((branch) => (
                <tr key={branch.id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                        <Image src={branch.image} alt={branch.name} fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="font-medium text-neutral-900">{branch.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{branch.location}</td>
                  <td className="px-5 py-3 text-neutral-600">{branch.displayOrder}</td>
                  <td className="px-5 py-3">
                    <StatusBadge active={branch.isActive} />
                  </td>
                  <td className="px-5 py-3">
                    <BranchRowActions id={branch.id} name={branch.name} isActive={branch.isActive} />
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
