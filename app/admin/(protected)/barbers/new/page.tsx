import { verifySession } from "@/lib/auth/dal";
import BarberForm from "@/components/admin/BarberForm";

export default async function NewBarberPage() {
  await verifySession();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Add Barber</h1>
        <p className="mt-1 text-sm text-neutral-500">Create a new team member for the public homepage.</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <BarberForm />
      </div>
    </div>
  );
}
