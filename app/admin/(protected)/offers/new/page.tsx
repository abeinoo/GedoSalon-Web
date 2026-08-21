import { verifySession } from "@/lib/auth/dal";
import OfferForm from "@/components/admin/OfferForm";

export default async function NewOfferPage() {
  await verifySession();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Add Offer</h1>
        <p className="mt-1 text-sm text-neutral-500">Create a new offer for the public homepage.</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <OfferForm />
      </div>
    </div>
  );
}
