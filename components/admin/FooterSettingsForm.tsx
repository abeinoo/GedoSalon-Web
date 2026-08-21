"use client";

import { useActionState } from "react";
import { updateFooterSettings } from "@/app/admin/(protected)/settings/footer/actions";
import type { FooterSettings } from "@/lib/generated/prisma/client";

export default function FooterSettingsForm({ footerSettings }: { footerSettings: FooterSettings | null }) {
  const [state, formAction, pending] = useActionState(updateFooterSettings, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <label htmlFor="tagline" className="text-xs font-medium tracking-widest text-neutral-500">
          TAGLINE
        </label>
        <input
          id="tagline"
          name="tagline"
          defaultValue={footerSettings?.tagline}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.tagline && <p className="mt-1.5 text-xs text-red-500">{state.errors.tagline[0]}</p>}
      </div>

      <div>
        <label htmlFor="copyrightText" className="text-xs font-medium tracking-widest text-neutral-500">
          COPYRIGHT TEXT
        </label>
        <input
          id="copyrightText"
          name="copyrightText"
          defaultValue={footerSettings?.copyrightText}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.copyrightText && <p className="mt-1.5 text-xs text-red-500">{state.errors.copyrightText[0]}</p>}
      </div>

      {state?.message && (
        <p
          role="status"
          className={`rounded-md px-4 py-2.5 text-sm ${
            state.errors ? "border border-red-400/30 bg-red-50 text-red-600" : "border border-green-400/30 bg-green-50 text-green-700"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-neutral-900 px-7 py-3 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "SAVING…" : "SAVE CHANGES"}
      </button>
    </form>
  );
}
