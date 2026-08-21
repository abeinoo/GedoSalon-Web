"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createOffer, updateOffer } from "@/app/admin/(protected)/offers/actions";
import ImageUploadField from "./ImageUploadField";
import type { Offer } from "@/lib/generated/prisma/client";
import type { OfferFormState } from "@/lib/validation/schemas";

function toDateInputValue(date: Date | null | undefined) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default function OfferForm({ offer }: { offer?: Offer }) {
  const action = offer ? updateOffer.bind(null, offer.id) : createOffer;
  const [state, formAction, pending] = useActionState<OfferFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Title" name="title" defaultValue={offer?.title} error={state?.errors?.title?.[0]} />
        <Field label="Discount" name="discount" placeholder="e.g. Up to 40% OFF" defaultValue={offer?.discount} error={state?.errors?.discount?.[0]} />
      </div>

      <div>
        <label htmlFor="description" className="text-xs font-medium tracking-widest text-neutral-500">
          DESCRIPTION
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={offer?.description}
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.description && <p className="mt-1.5 text-xs text-red-500">{state.errors.description[0]}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field
          label="Price (EGP, optional)"
          name="price"
          type="number"
          step="0.01"
          defaultValue={offer?.price?.toString()}
          error={state?.errors?.price?.[0]}
        />
        <Field
          label="Display Order"
          name="displayOrder"
          type="number"
          defaultValue={(offer?.displayOrder ?? 0).toString()}
          error={state?.errors?.displayOrder?.[0]}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field
          label="Start Date (optional)"
          name="startDate"
          type="date"
          defaultValue={toDateInputValue(offer?.startDate)}
          error={state?.errors?.startDate?.[0]}
        />
        <Field
          label="End Date (optional)"
          name="endDate"
          type="date"
          defaultValue={toDateInputValue(offer?.endDate)}
          error={state?.errors?.endDate?.[0]}
        />
      </div>

      <div>
        <label className="text-xs font-medium tracking-widest text-neutral-500">IMAGE</label>
        <div className="mt-2">
          <ImageUploadField name="image" folder="offers" defaultValue={offer?.image} error={state?.errors?.image?.[0]} />
        </div>
      </div>

      <label className="flex w-fit items-center gap-2.5 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={offer?.isActive ?? true}
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
          {pending ? "SAVING…" : offer ? "SAVE CHANGES" : "CREATE OFFER"}
        </button>
        <Link
          href="/admin/offers"
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
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  type?: string;
  step?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
