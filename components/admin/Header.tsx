"use client";

import { logout } from "@/app/admin/actions/logout";
import { LogoutIcon } from "./icons";

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" viewBox="0 0 24 24" {...props}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

export default function Header({ email, onMenuClick }: { email: string; onMenuClick: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-5 sm:px-8">
      <button type="button" onClick={onMenuClick} aria-label="Open menu" className="text-neutral-700 lg:hidden">
        <MenuIcon className="h-6 w-6" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-600">{email}</span>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-xs font-medium tracking-widest text-neutral-700 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            <LogoutIcon className="h-4 w-4" />
            LOGOUT
          </button>
        </form>
      </div>
    </header>
  );
}
