"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteBranch, toggleBranchActive } from "@/app/admin/(protected)/branches/actions";
import ConfirmDialog from "./ConfirmDialog";

export default function BranchRowActions({ id, name, isActive }: { id: string; name: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleBranchActive(id, !isActive))}
        className="text-xs font-medium tracking-widest text-neutral-500 transition hover:text-neutral-900 disabled:opacity-50"
      >
        {isActive ? "DISABLE" : "ENABLE"}
      </button>
      <Link href={`/admin/branches/${id}/edit`} className="text-xs font-medium tracking-widest text-neutral-500 transition hover:text-neutral-900">
        EDIT
      </Link>
      <ConfirmDialog
        title="Delete branch?"
        description={`This will permanently remove "${name}" from the site.`}
        onConfirm={() => startTransition(() => deleteBranch(id))}
        trigger={
          <button type="button" disabled={isPending} className="text-xs font-medium tracking-widest text-red-500 transition hover:text-red-700 disabled:opacity-50">
            DELETE
          </button>
        }
      />
    </div>
  );
}
