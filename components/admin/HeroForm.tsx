"use client";

import { useActionState } from "react";
import { updateHero } from "@/app/admin/(protected)/hero/actions";
import ImageUploadField from "./ImageUploadField";
import type { HeroContent } from "@/lib/generated/prisma/client";

export default function HeroForm({ hero }: { hero: HeroContent | null }) {
  const [state, formAction, pending] = useActionState(updateHero, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field label="Label" name="label" defaultValue={hero?.label} error={state?.errors?.label?.[0]} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Heading Line 1" name="headingLine1" defaultValue={hero?.headingLine1} error={state?.errors?.headingLine1?.[0]} />
        <Field label="Heading Line 2" name="headingLine2" defaultValue={hero?.headingLine2} error={state?.errors?.headingLine2?.[0]} />
      </div>

      <Field label="Subtitle" name="subtitle" defaultValue={hero?.subtitle} error={state?.errors?.subtitle?.[0]} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Button Text" name="ctaLabel" defaultValue={hero?.ctaLabel} error={state?.errors?.ctaLabel?.[0]} />
        <Field label="Button URL" name="ctaHref" defaultValue={hero?.ctaHref} error={state?.errors?.ctaHref?.[0]} />
      </div>

      <div>
        <label className="text-xs font-medium tracking-widest text-neutral-500">BACKGROUND IMAGE</label>
        <div className="mt-2">
          <ImageUploadField name="image" folder="hero" defaultValue={hero?.image} error={state?.errors?.image?.[0]} />
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

function Field({
  label,
  name,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-medium tracking-widest text-neutral-500">
        {label.toUpperCase()}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
