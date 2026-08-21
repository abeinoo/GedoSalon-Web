"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteOpeningHours, toggleOpeningHoursActive } from "@/app/admin/(protected)/settings/footer/hours/actions";
import ConfirmDialog from "./ConfirmDialog";

export default function OpeningHoursRowActions({ id, label, isActive }: { id: string; label: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleOpeningHoursActive(id, !isActive))}
        className="text-xs font-medium tracking-widest text-neutral-500 transition hover:text-neutral-900 disabled:opacity-50"
      >
        {isActive ? "DISABLE" : "ENABLE"}
      </button>
      <Link href={`/admin/settings/footer/hours/${id}/edit`} className="text-xs font-medium tracking-widest text-neutral-500 transition hover:text-neutral-900">
        EDIT
      </Link>
      <ConfirmDialog
        title="Delete hours row?"
        description={`This will remove "${label}" from the footer's opening hours.`}
        onConfirm={() => startTransition(() => deleteOpeningHours(id))}
        trigger={
          <button type="button" disabled={isPending} className="text-xs font-medium tracking-widest text-red-500 transition hover:text-red-700 disabled:opacity-50">
            DELETE
          </button>
        }
      />
    </div>
  );
}
