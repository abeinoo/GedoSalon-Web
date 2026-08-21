import { verifySession } from "@/lib/auth/dal";
import BranchForm from "@/components/admin/BranchForm";

export default async function NewBranchPage() {
  await verifySession();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Add Branch</h1>
        <p className="mt-1 text-sm text-neutral-500">Create a new branch for the public homepage.</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <BranchForm />
      </div>
    </div>
  );
}
