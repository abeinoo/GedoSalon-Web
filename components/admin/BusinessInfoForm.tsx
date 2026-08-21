"use client";

import { useActionState } from "react";
import { updateBusinessInfo } from "@/app/admin/(protected)/settings/business/actions";
import type { BusinessInfo } from "@/lib/generated/prisma/client";

export default function BusinessInfoForm({ businessInfo }: { businessInfo: BusinessInfo | null }) {
  const [state, formAction, pending] = useActionState(updateBusinessInfo, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field label="Legal Business Name" name="legalName" defaultValue={businessInfo?.legalName} error={state?.errors?.legalName?.[0]} />

      <div>
        <label htmlFor="address" className="text-xs font-medium tracking-widest text-neutral-500">
          ADDRESS (ONE LINE PER ROW)
        </label>
        <textarea
          id="address"
          name="address"
          rows={4}
          defaultValue={businessInfo?.address}
          dir="auto"
          className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        {state?.errors?.address && <p className="mt-1.5 text-xs text-red-500">{state.errors.address[0]}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Business Phone" name="phone" defaultValue={businessInfo?.phone} error={state?.errors?.phone?.[0]} />
        <Field label="Email" name="email" type="email" defaultValue={businessInfo?.email} error={state?.errors?.email?.[0]} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field
          label="WhatsApp Number (display)"
          name="whatsappNumber"
          defaultValue={businessInfo?.whatsappNumber}
          error={state?.errors?.whatsappNumber?.[0]}
        />
        <Field
          label="WhatsApp Link"
          name="whatsappHref"
          placeholder="https://wa.me/..."
          defaultValue={businessInfo?.whatsappHref}
          error={state?.errors?.whatsappHref?.[0]}
        />
      </div>

      <Field label="Website" name="website" defaultValue={businessInfo?.website} error={state?.errors?.website?.[0]} />

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
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  type?: string;
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
        dir="auto"
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
