"use client";

import { useActionState, useState } from "react";
import { changePassword } from "@/app/admin/(protected)/settings/password/actions";
import { EyeIcon, EyeOffIcon } from "./icons";

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field
        label="Current Password"
        name="currentPassword"
        error={state?.errors?.currentPassword?.[0]}
      />
      <Field
        label="New Password"
        name="newPassword"
        error={state?.errors?.newPassword?.[0]}
        hint="At least 8 characters."
      />
      <Field
        label="Confirm New Password"
        name="confirmPassword"
        error={state?.errors?.confirmPassword?.[0]}
      />

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
        {pending ? "SAVING…" : "CHANGE PASSWORD"}
      </button>
    </form>
  );
}

function Field({ label, name, error, hint }: { label: string; name: string; error?: string; hint?: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={name} className="text-xs font-medium tracking-widest text-neutral-500">
        {label.toUpperCase()}
      </label>
      <div className="relative mt-2">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={name === "currentPassword" ? "current-password" : "new-password"}
          required
          className="w-full rounded-md border border-neutral-300 px-3.5 py-2.5 pr-11 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-neutral-400 transition hover:text-neutral-700"
        >
          {visible ? <EyeOffIcon className="h-[18px] w-[18px]" /> : <EyeIcon className="h-[18px] w-[18px]" />}
        </button>
      </div>
      {hint && !error && <p className="mt-1.5 text-xs text-neutral-400">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
