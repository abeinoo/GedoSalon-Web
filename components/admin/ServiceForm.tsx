"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createService, updateService } from "@/app/admin/(protected)/services/actions";
import ImageUploadField from "./ImageUploadField";
import type { Service } from "@/lib/generated/prisma/client";
import type { ServiceFormState } from "@/lib/validation/schemas";

export default function ServiceForm({ service }: { service?: Service }) {
  const action = service ? updateService.bind(null, service.id) : createService;
  const [state, formAction, pending] = useActionState<ServiceFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" defaultValue={service?.name} error={state?.errors?.name?.[0]} />
        <Field label="Category" name="category" defaultValue={service?.category} error={state?.errors?.category?.[0]} />
      </div>

      <div>
        <label htmlFor="description" className="text-xs font-medium tracking-widest text-neutral-500">
          DESCRIPTION
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={service?.description}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.description && <p className="mt-1.5 text-xs text-red-500">{state.errors.description[0]}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field
          label="Price (EGP)"
          name="price"
          type="number"
          step="0.01"
          defaultValue={service?.price?.toString()}
          error={state?.errors?.price?.[0]}
        />
        <Field
          label="Display Order"
          name="displayOrder"
          type="number"
          defaultValue={(service?.displayOrder ?? 0).toString()}
          error={state?.errors?.displayOrder?.[0]}
        />
      </div>

      <div>
        <label className="text-xs font-medium tracking-widest text-neutral-500">IMAGE</label>
        <div className="mt-2">
          <ImageUploadField name="image" folder="services" defaultValue={service?.image} error={state?.errors?.image?.[0]} />
        </div>
      </div>

      <label className="flex w-fit items-center gap-2.5 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={service?.isActive ?? true}
          className="h-4 w-4 rounded border-neutral-300"
        />
        Active on public site
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-full bg-neutral-900 px-7 py-3 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "SAVING…" : service ? "SAVE CHANGES" : "CREATE SERVICE"}
        </button>
        <Link
          href="/admin/services"
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
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  type?: string;
  step?: string;
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
        step={step}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
