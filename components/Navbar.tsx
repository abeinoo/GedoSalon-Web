"use client";

import { useState } from "react";
import Image from "next/image";
import { navLinks, siteContent, bookingHref } from "@/lib/content";
import { CloseIcon, MenuIcon } from "./icons";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a href="#home" className="flex items-center gap-3 shrink-0">
          <Image
            src={siteContent.brand.logo}
            alt={siteContent.brand.name}
            width={150}
            height={150}
            priority
            className="h-[88px] w-[88px] object-contain sm:h-[108px] sm:w-[108px]"
          />
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-xs font-medium tracking-widest text-white/90 transition hover:text-white ${
                  i === 0 ? "relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white" : ""
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={bookingHref}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 rounded-full border border-white/70 px-6 py-2.5 text-xs font-medium tracking-widest text-white transition hover:bg-white hover:text-black lg:inline-block"
        >
          BOOK NOW
        </a>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-white lg:hidden"
          aria-label="Open menu"
        >
          <MenuIcon className="h-7 w-7" />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950 px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <Image
              src={siteContent.brand.logo}
              alt={siteContent.brand.name}
              width={96}
              height={96}
              className="h-16 w-16 object-contain"
            />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="text-white">
              <CloseIcon className="h-7 w-7" />
            </button>
          </div>

          <ul className="mt-12 flex flex-col gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium tracking-widest text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={bookingHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-10 inline-block w-fit rounded-full border border-white/70 px-6 py-3 text-xs font-medium tracking-widest text-white"
          >
            BOOK NOW
          </a>
        </div>
      )}
    </header>
  );
}
