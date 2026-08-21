"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteOffer, toggleOfferActive } from "@/app/admin/(protected)/offers/actions";
import ConfirmDialog from "./ConfirmDialog";

export default function OfferRowActions({
  id,
  title,
  isActive,
}: {
  id: string;
  title: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleOfferActive(id, !isActive))}
        className="text-xs font-medium tracking-widest text-neutral-500 transition hover:text-neutral-900 disabled:opacity-50"
      >
        {isActive ? "DISABLE" : "ENABLE"}
      </button>
      <Link
        href={`/admin/offers/${id}/edit`}
        className="text-xs font-medium tracking-widest text-neutral-500 transition hover:text-neutral-900"
      >
        EDIT
      </Link>
      <ConfirmDialog
        title="Delete offer?"
        description={`This will permanently remove "${title}" from the site.`}
        onConfirm={() => startTransition(() => deleteOffer(id))}
        trigger={
          <button type="button" disabled={isPending} className="text-xs font-medium tracking-widest text-red-500 transition hover:text-red-700 disabled:opacity-50">
            DELETE
          </button>
        }
      />
    </div>
  );
}
