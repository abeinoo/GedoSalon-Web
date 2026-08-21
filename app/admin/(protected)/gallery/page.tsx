import Link from "next/link";
import Image from "next/image";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import GalleryImageRowActions from "@/components/admin/GalleryImageRowActions";

export default async function AdminGalleryPage() {
  await verifySession();
  const images = await prisma.galleryImage.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Gallery</h1>
          <p className="mt-1 text-sm text-neutral-500">{images.length} total</p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800"
        >
          + ADD IMAGE
        </Link>
      </div>

      {images.length === 0 ? (
        <EmptyState
          title="No gallery images yet"
          description="Add your first photo so it can appear on the public homepage."
          actionLabel="Add Image"
          actionHref="/admin/gallery/new"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <div className="relative aspect-square w-full bg-neutral-100">
                <Image src={image.image} alt="" fill sizes="200px" className="object-cover" />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Order {image.displayOrder}</span>
                  <StatusBadge active={image.isActive} />
                </div>
              </div>
              <div className="px-3 pb-3">
                <GalleryImageRowActions id={image.id} isActive={image.isActive} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
