import { verifySession } from "@/lib/auth/dal";
import ServiceForm from "@/components/admin/ServiceForm";

export default async function NewServicePage() {
  await verifySession();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Add Service</h1>
        <p className="mt-1 text-sm text-neutral-500">Create a new service for the public homepage.</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <ServiceForm />
      </div>
    </div>
  );
}
