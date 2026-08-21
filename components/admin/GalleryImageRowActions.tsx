"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteGalleryImage, toggleGalleryImageActive } from "@/app/admin/(protected)/gallery/actions";
import ConfirmDialog from "./ConfirmDialog";

export default function GalleryImageRowActions({ id, isActive }: { id: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleGalleryImageActive(id, !isActive))}
        className="text-xs font-medium tracking-widest text-neutral-500 transition hover:text-neutral-900 disabled:opacity-50"
      >
        {isActive ? "DISABLE" : "ENABLE"}
      </button>
      <Link href={`/admin/gallery/${id}/edit`} className="text-xs font-medium tracking-widest text-neutral-500 transition hover:text-neutral-900">
        EDIT
      </Link>
      <ConfirmDialog
        title="Delete image?"
        description="This will permanently remove this image from the gallery."
        onConfirm={() => startTransition(() => deleteGalleryImage(id))}
        trigger={
          <button type="button" disabled={isPending} className="text-xs font-medium tracking-widest text-red-500 transition hover:text-red-700 disabled:opacity-50">
            DELETE
          </button>
        }
      />
    </div>
  );
}
