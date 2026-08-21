"use client";

import { useActionState } from "react";
import { updateAbout } from "@/app/admin/(protected)/about/actions";
import ImageUploadField from "./ImageUploadField";
import type { AboutContent } from "@/lib/generated/prisma/client";

export default function AboutForm({ about }: { about: AboutContent | null }) {
  const [state, formAction, pending] = useActionState(updateAbout, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Section Label" name="label" defaultValue={about?.label} error={state?.errors?.label?.[0]} />
        <Field label="Title" name="title" defaultValue={about?.title} error={state?.errors?.title?.[0]} />
      </div>

      <TextArea
        label="Description"
        name="description"
        defaultValue={about?.description}
        error={state?.errors?.description?.[0]}
      />
      <TextArea
        label="Secondary Description"
        name="secondaryDescription"
        defaultValue={about?.secondaryDescription}
        error={state?.errors?.secondaryDescription?.[0]}
      />

      <div>
        <label className="text-xs font-medium tracking-widest text-neutral-500">IMAGE</label>
        <div className="mt-2">
          <ImageUploadField name="image" folder="about" defaultValue={about?.image} error={state?.errors?.image?.[0]} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Button Text" name="buttonText" defaultValue={about?.buttonText} error={state?.errors?.buttonText?.[0]} />
        <Field label="Button URL" name="buttonUrl" defaultValue={about?.buttonUrl} error={state?.errors?.buttonUrl?.[0]} />
      </div>

      <label className="flex w-fit items-center gap-2.5 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={about?.isActive ?? true}
          className="h-4 w-4 rounded border-neutral-300"
        />
        Active on public site
      </label>

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

function TextArea({
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
      <textarea
        id={name}
        name={name}
        rows={3}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
