"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/lib/content";

export default function PublicError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // Client Components can't import server-only modules, so this goes
    // through the browser console rather than lib/logger's server-side
    // JSON lines. `error.digest` is Next's redacted server-side reference
    // for this failure — safe to show, unlike the raw message/stack.
    console.error("public.page_error", { digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-5 py-16 text-center">
      <Image
        src={siteContent.brand.logo}
        alt={siteContent.brand.name}
        width={80}
        height={80}
        className="h-16 w-16 object-contain opacity-80"
      />
      <h1 className="mt-6 text-2xl font-bold tracking-wide text-neutral-900">Something went wrong</h1>
      <p className="mt-3 max-w-sm text-sm text-neutral-500">
        We&apos;re having trouble loading this page right now. Please try again in a moment.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full border border-neutral-400 px-7 py-3 text-xs font-medium tracking-widest text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
      >
        BACK TO HOMEPAGE
      </Link>
      {error.digest && <p className="mt-6 text-xs text-neutral-300">Reference: {error.digest}</p>}
    </div>
  );
}
