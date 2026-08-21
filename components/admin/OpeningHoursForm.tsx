"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createOpeningHours, updateOpeningHours } from "@/app/admin/(protected)/settings/footer/hours/actions";
import type { OpeningHoursFormState } from "@/lib/validation/schemas";
import type { OpeningHours } from "@/lib/generated/prisma/client";

export default function OpeningHoursForm({ openingHours }: { openingHours?: OpeningHours }) {
  const action = openingHours ? updateOpeningHours.bind(null, openingHours.id) : createOpeningHours;
  const [state, formAction, pending] = useActionState<OpeningHoursFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <label htmlFor="label" className="text-xs font-medium tracking-widest text-neutral-500">
          LABEL
        </label>
        <input
          id="label"
          name="label"
          placeholder="e.g. Sunday - Thursday"
          defaultValue={openingHours?.label}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.label && <p className="mt-1.5 text-xs text-red-500">{state.errors.label[0]}</p>}
      </div>

      <div>
        <label htmlFor="value" className="text-xs font-medium tracking-widest text-neutral-500">
          HOURS
        </label>
        <input
          id="value"
          name="value"
          placeholder="e.g. 10:00 AM - 12:00 AM"
          defaultValue={openingHours?.value}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.value && <p className="mt-1.5 text-xs text-red-500">{state.errors.value[0]}</p>}
      </div>

      <div>
        <label htmlFor="displayOrder" className="text-xs font-medium tracking-widest text-neutral-500">
          DISPLAY ORDER
        </label>
        <input
          id="displayOrder"
          name="displayOrder"
          type="number"
          defaultValue={(openingHours?.displayOrder ?? 0).toString()}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.displayOrder && <p className="mt-1.5 text-xs text-red-500">{state.errors.displayOrder[0]}</p>}
      </div>

      <label className="flex w-fit items-center gap-2.5 text-sm text-neutral-700">
        <input type="checkbox" name="isActive" defaultChecked={openingHours?.isActive ?? true} className="h-4 w-4 rounded border-neutral-300" />
        Active on public site
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-full bg-neutral-900 px-7 py-3 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "SAVING…" : openingHours ? "SAVE CHANGES" : "ADD HOURS ROW"}
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
