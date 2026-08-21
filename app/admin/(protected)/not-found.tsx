import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-16 text-center">
      <p className="text-sm font-semibold text-neutral-900">Not found</p>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">The item you&apos;re looking for doesn&apos;t exist or was removed.</p>
      <Link
        href="/admin"
        className="mt-6 inline-flex items-center rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium tracking-widest text-white transition hover:bg-neutral-800"
      >
        BACK TO DASHBOARD
      </Link>
    </div>
  );
}
