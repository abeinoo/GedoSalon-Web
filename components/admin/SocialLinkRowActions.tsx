"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteSocialLink, toggleSocialLinkActive } from "@/app/admin/(protected)/settings/footer/social/actions";
import ConfirmDialog from "./ConfirmDialog";

export default function SocialLinkRowActions({ id, platform, isActive }: { id: string; platform: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleSocialLinkActive(id, !isActive))}
        className="text-xs font-medium tracking-widest text-neutral-500 transition hover:text-neutral-900 disabled:opacity-50"
      >
        {isActive ? "DISABLE" : "ENABLE"}
      </button>
      <Link href={`/admin/settings/footer/social/${id}/edit`} className="text-xs font-medium tracking-widest text-neutral-500 transition hover:text-neutral-900">
        EDIT
      </Link>
      <ConfirmDialog
        title="Delete social link?"
        description={`This will remove the ${platform} link from the footer.`}
        onConfirm={() => startTransition(() => deleteSocialLink(id))}
        trigger={
          <button type="button" disabled={isPending} className="text-xs font-medium tracking-widest text-red-500 transition hover:text-red-700 disabled:opacity-50">
            DELETE
          </button>
        }
      />
    </div>
  );
}
