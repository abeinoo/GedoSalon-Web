"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteBarber, toggleBarberActive } from "@/app/admin/(protected)/barbers/actions";
import ConfirmDialog from "./ConfirmDialog";

export default function BarberRowActions({ id, name, isActive }: { id: string; name: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleBarberActive(id, !isActive))}
        className="text-xs font-medium tracking-widest text-neutral-500 transition hover:text-neutral-900 disabled:opacity-50"
      >
        {isActive ? "DISABLE" : "ENABLE"}
      </button>
      <Link href={`/admin/barbers/${id}/edit`} className="text-xs font-medium tracking-widest text-neutral-500 transition hover:text-neutral-900">
        EDIT
      </Link>
      <ConfirmDialog
        title="Delete barber?"
        description={`This will permanently remove "${name}" from the site.`}
        onConfirm={() => startTransition(() => deleteBarber(id))}
        trigger={
          <button type="button" disabled={isPending} className="text-xs font-medium tracking-widest text-red-500 transition hover:text-red-700 disabled:opacity-50">
            DELETE
          </button>
        }
      />
    </div>
  );
}
