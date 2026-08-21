"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createSocialLink, updateSocialLink } from "@/app/admin/(protected)/settings/footer/social/actions";
import { SOCIAL_PLATFORMS, type SocialLinkFormState } from "@/lib/validation/schemas";
import type { SocialLink } from "@/lib/generated/prisma/client";

export default function SocialLinkForm({ socialLink }: { socialLink?: SocialLink }) {
  const action = socialLink ? updateSocialLink.bind(null, socialLink.id) : createSocialLink;
  const [state, formAction, pending] = useActionState<SocialLinkFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <label htmlFor="platform" className="text-xs font-medium tracking-widest text-neutral-500">
          PLATFORM
        </label>
        <select
          id="platform"
          name="platform"
          defaultValue={socialLink?.platform ?? SOCIAL_PLATFORMS[0]}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        >
          {SOCIAL_PLATFORMS.map((platform) => (
            <option key={platform} value={platform}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </option>
          ))}
        </select>
        {state?.errors?.platform && <p className="mt-1.5 text-xs text-red-500">{state.errors.platform[0]}</p>}
      </div>

      <div>
        <label htmlFor="href" className="text-xs font-medium tracking-widest text-neutral-500">
          LINK
        </label>
        <input
          id="href"
          name="href"
          defaultValue={socialLink?.href}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.href && <p className="mt-1.5 text-xs text-red-500">{state.errors.href[0]}</p>}
      </div>

      <div>
        <label htmlFor="displayOrder" className="text-xs font-medium tracking-widest text-neutral-500">
          DISPLAY ORDER
        </label>
        <input
          id="displayOrder"
          name="displayOrder"
          type="number"
          defaultValue={(socialLink?.displayOrder ?? 0).toString()}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.displayOrder && <p className="mt-1.5 text-xs text-red-500">{state.errors.displayOrder[0]}</p>}
      </div>

      <label className="flex w-fit items-center gap-2.5 text-sm text-neutral-700">
        <input type="checkbox" name="isActive" defaultChecked={socialLink?.isActive ?? true} className="h-4 w-4 rounded border-neutral-300" />
        Active on public site
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-full bg-neutral-900 px-7 py-3 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "SAVING…" : socialLink ? "SAVE CHANGES" : "ADD SOCIAL LINK"}
        </button>
        <Link
          href="/admin/settings/footer"
          className="rounded-full border border-neutral-300 px-7 py-3 text-xs font-medium tracking-widest text-neutral-700 transition hover:border-neutral-900"
        >
          CANCEL
        </Link>
      </div>
    </form>
  );
}
