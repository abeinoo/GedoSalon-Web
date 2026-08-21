"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createGalleryImage, updateGalleryImage } from "@/app/admin/(protected)/gallery/actions";
import ImageUploadField from "./ImageUploadField";
import type { GalleryImage } from "@/lib/generated/prisma/client";
import type { GalleryImageFormState } from "@/lib/validation/schemas";

export default function GalleryImageForm({ galleryImage }: { galleryImage?: GalleryImage }) {
  const action = galleryImage ? updateGalleryImage.bind(null, galleryImage.id) : createGalleryImage;
  const [state, formAction, pending] = useActionState<GalleryImageFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <label className="text-xs font-medium tracking-widest text-neutral-500">IMAGE</label>
        <div className="mt-2">
          <ImageUploadField name="image" folder="gallery" defaultValue={galleryImage?.image} error={state?.errors?.image?.[0]} />
        </div>
      </div>

      <div>
        <label htmlFor="displayOrder" className="text-xs font-medium tracking-widest text-neutral-500">
          DISPLAY ORDER
        </label>
        <input
          id="displayOrder"
          name="displayOrder"
          type="number"
          defaultValue={(galleryImage?.displayOrder ?? 0).toString()}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.displayOrder && <p className="mt-1.5 text-xs text-red-500">{state.errors.displayOrder[0]}</p>}
      </div>

      <label className="flex w-fit items-center gap-2.5 text-sm text-neutral-700">
        <input type="checkbox" name="isActive" defaultChecked={galleryImage?.isActive ?? true} className="h-4 w-4 rounded border-neutral-300" />
        Active on public site
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-full bg-neutral-900 px-7 py-3 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "SAVING…" : galleryImage ? "SAVE CHANGES" : "ADD IMAGE"}
        </button>
        <Link
          href="/admin/gallery"
          className="rounded-full border border-neutral-300 px-7 py-3 text-xs font-medium tracking-widest text-neutral-700 transition hover:border-neutral-900"
        >
          CANCEL
        </Link>
      </div>
    </form>
  );
}
