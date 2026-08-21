"use client";

import { useEffect } from "react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
      <p className="text-sm font-semibold text-red-700">Something went wrong.</p>
      <p className="mt-1 max-w-sm text-sm text-red-600">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center rounded-full bg-red-600 px-6 py-2.5 text-xs font-medium tracking-widest text-white transition hover:bg-red-700"
      >
        TRY AGAIN
      </button>
    </div>
  );
}
