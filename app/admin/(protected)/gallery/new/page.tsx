import { verifySession } from "@/lib/auth/dal";
import GalleryImageForm from "@/components/admin/GalleryImageForm";

export default async function NewGalleryImagePage() {
  await verifySession();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Add Gallery Image</h1>
      </div>

      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <GalleryImageForm />
      </div>
    </div>
  );
}
