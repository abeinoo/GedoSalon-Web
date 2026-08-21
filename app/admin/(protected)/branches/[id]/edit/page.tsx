import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import BranchForm from "@/components/admin/BranchForm";

export default async function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  await verifySession();
  const { id } = await params;
  const branch = await prisma.branch.findUnique({ where: { id } });

  if (!branch) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Branch</h1>
        <p className="mt-1 text-sm text-neutral-500">{branch.name}</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <BranchForm branch={branch} />
      </div>
    </div>
  );
}
