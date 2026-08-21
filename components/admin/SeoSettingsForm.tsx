"use client";

import { useActionState } from "react";
import { updateSeoSettings } from "@/app/admin/(protected)/settings/seo/actions";
import ImageUploadField from "./ImageUploadField";
import type { SeoSettings } from "@/lib/generated/prisma/client";

export default function SeoSettingsForm({ seoSettings }: { seoSettings: SeoSettings | null }) {
  const [state, formAction, pending] = useActionState(updateSeoSettings, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <label htmlFor="metaTitle" className="text-xs font-medium tracking-widest text-neutral-500">
          META TITLE
        </label>
        <input
          id="metaTitle"
          name="metaTitle"
          defaultValue={seoSettings?.metaTitle}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.metaTitle && <p className="mt-1.5 text-xs text-red-500">{state.errors.metaTitle[0]}</p>}
      </div>

      <div>
        <label htmlFor="metaDescription" className="text-xs font-medium tracking-widest text-neutral-500">
          META DESCRIPTION
        </label>
        <textarea
          id="metaDescription"
          name="metaDescription"
          rows={3}
          defaultValue={seoSettings?.metaDescription}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.metaDescription && <p className="mt-1.5 text-xs text-red-500">{state.errors.metaDescription[0]}</p>}
      </div>

      <div>
        <label htmlFor="keywords" className="text-xs font-medium tracking-widest text-neutral-500">
          KEYWORDS (COMMA SEPARATED, OPTIONAL)
        </label>
        <input
          id="keywords"
          name="keywords"
          defaultValue={seoSettings?.keywords ?? ""}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.keywords && <p className="mt-1.5 text-xs text-red-500">{state.errors.keywords[0]}</p>}
      </div>

      <div>
        <label className="text-xs font-medium tracking-widest text-neutral-500">SOCIAL SHARE IMAGE (OPTIONAL)</label>
        <div className="mt-2">
          <ImageUploadField name="ogImage" folder="seo" defaultValue={seoSettings?.ogImage ?? undefined} error={state?.errors?.ogImage?.[0]} />
        </div>
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
