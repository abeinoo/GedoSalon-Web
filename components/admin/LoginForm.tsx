"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/login/actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="text-xs font-medium tracking-widest text-white/70">
          EMAIL
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-2 w-full rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40"
          placeholder="admin@gedosalons.com"
        />
        {state?.errors?.email && (
          <p className="mt-1.5 text-xs text-red-400">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="text-xs font-medium tracking-widest text-white/70">
          PASSWORD
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40"
          placeholder="••••••••"
        />
        {state?.errors?.password && (
          <p className="mt-1.5 text-xs text-red-400">{state.errors.password[0]}</p>
        )}
      </div>

      {state?.message && (
        <p role="alert" className="rounded-md border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-medium tracking-widest text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "SIGNING IN…" : "SIGN IN"}
      </button>
    </form>
  );
}
