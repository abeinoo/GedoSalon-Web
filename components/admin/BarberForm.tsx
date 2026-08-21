"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createBarber, updateBarber } from "@/app/admin/(protected)/barbers/actions";
import ImageUploadField from "./ImageUploadField";
import type { Barber } from "@/lib/generated/prisma/client";
import type { BarberFormState } from "@/lib/validation/schemas";

export default function BarberForm({ barber }: { barber?: Barber }) {
  const action = barber ? updateBarber.bind(null, barber.id) : createBarber;
  const [state, formAction, pending] = useActionState<BarberFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" defaultValue={barber?.name} error={state?.errors?.name?.[0]} />
        <Field label="Title" name="title" defaultValue={barber?.title} error={state?.errors?.title?.[0]} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Booking Link" name="bookHref" defaultValue={barber?.bookHref ?? "#contact"} error={state?.errors?.bookHref?.[0]} />
        <Field
          label="Display Order"
          name="displayOrder"
          type="number"
          defaultValue={(barber?.displayOrder ?? 0).toString()}
          error={state?.errors?.displayOrder?.[0]}
        />
      </div>

      <div>
        <label className="text-xs font-medium tracking-widest text-neutral-500">PHOTO</label>
        <div className="mt-2">
          <ImageUploadField name="image" folder="barbers" defaultValue={barber?.image} error={state?.errors?.image?.[0]} />
        </div>
      </div>

      <label className="flex w-fit items-center gap-2.5 text-sm text-neutral-700">
        <input type="checkbox" name="isActive" defaultChecked={barber?.isActive ?? true} className="h-4 w-4 rounded border-neutral-300" />
        Active on public site
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-full bg-neutral-900 px-7 py-3 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "SAVING…" : barber ? "SAVE CHANGES" : "CREATE BARBER"}
        </button>
        <Link
          href="/admin/barbers"
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
