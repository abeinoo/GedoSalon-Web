"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createBranch, updateBranch } from "@/app/admin/(protected)/branches/actions";
import ImageUploadField from "./ImageUploadField";
import type { Branch } from "@/lib/generated/prisma/client";
import type { BranchFormState } from "@/lib/validation/schemas";

export default function BranchForm({ branch }: { branch?: Branch }) {
  const action = branch ? updateBranch.bind(null, branch.id) : createBranch;
  const [state, formAction, pending] = useActionState<BranchFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" defaultValue={branch?.name} error={state?.errors?.name?.[0]} />
        <Field label="Location" name="location" defaultValue={branch?.location} error={state?.errors?.location?.[0]} />
      </div>

      <Field
        label="Display Order"
        name="displayOrder"
        type="number"
        defaultValue={(branch?.displayOrder ?? 0).toString()}
        error={state?.errors?.displayOrder?.[0]}
      />

      <div>
        <label className="text-xs font-medium tracking-widest text-neutral-500">IMAGE</label>
        <div className="mt-2">
          <ImageUploadField name="image" folder="branches" defaultValue={branch?.image} error={state?.errors?.image?.[0]} />
        </div>
      </div>

      <label className="flex w-fit items-center gap-2.5 text-sm text-neutral-700">
        <input type="checkbox" name="isActive" defaultChecked={branch?.isActive ?? true} className="h-4 w-4 rounded border-neutral-300" />
        Active on public site
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-full bg-neutral-900 px-7 py-3 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "SAVING…" : branch ? "SAVE CHANGES" : "CREATE BRANCH"}
        </button>
        <Link
          href="/admin/branches"
          className="rounded-full border border-neutral-300 px-7 py-3 text-xs font-medium tracking-widest text-neutral-700 transition hover:border-neutral-900"
        >
          CANCEL
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  error,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-medium tracking-widest text-neutral-500">
        {label.toUpperCase()}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
