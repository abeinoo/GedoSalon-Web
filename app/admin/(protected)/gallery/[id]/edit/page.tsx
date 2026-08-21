import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import GalleryImageForm from "@/components/admin/GalleryImageForm";

export default async function EditGalleryImagePage({ params }: { params: Promise<{ id: string }> }) {
  await verifySession();
  const { id } = await params;
  const galleryImage = await prisma.galleryImage.findUnique({ where: { id } });

  if (!galleryImage) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Gallery Image</h1>
      </div>

      <div className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <GalleryImageForm galleryImage={galleryImage} />
      </div>
    </div>
  );
}
