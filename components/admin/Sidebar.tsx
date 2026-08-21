"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteContent } from "@/lib/content";
import {
  DashboardIcon,
  HomeIcon,
  InfoIcon,
  ScissorsNavIcon,
  TagIcon,
  UsersIcon,
  MapPinIcon,
  GalleryIcon,
  SettingsIcon,
  KeyIcon,
  ChevronDownIcon,
} from "./icons";
import type { ComponentType, SVGProps } from "react";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

type LinkItem = { type: "link"; label: string; href: string; icon: Icon };
type GroupItem = { type: "group"; label: string; icon: Icon; children: { label: string; href: string; icon: Icon }[] };
type NavEntry = LinkItem | GroupItem;

const navItems: NavEntry[] = [
  { type: "link", label: "Dashboard", href: "/admin", icon: DashboardIcon },
  { type: "link", label: "Homepage", href: "/admin/hero", icon: HomeIcon },
  { type: "link", label: "About Us", href: "/admin/about", icon: InfoIcon },
  { type: "link", label: "Services", href: "/admin/services", icon: ScissorsNavIcon },
  { type: "link", label: "Offers", href: "/admin/offers", icon: TagIcon },
  { type: "link", label: "Branches", href: "/admin/branches", icon: MapPinIcon },
  { type: "link", label: "Barbers", href: "/admin/barbers", icon: UsersIcon },
  { type: "link", label: "Gallery", href: "/admin/gallery", icon: GalleryIcon },
  {
    type: "group",
    label: "Settings",
    icon: SettingsIcon,
    children: [
      { label: "Business Information", href: "/admin/settings/business", icon: InfoIcon },
      { label: "Footer", href: "/admin/settings/footer", icon: MapPinIcon },
      { label: "SEO", href: "/admin/settings/seo", icon: TagIcon },
      { label: "Change Password", href: "/admin/settings/password", icon: KeyIcon },
    ],
  },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isUnderSettings = pathname.startsWith("/admin/settings");
  const [settingsOpen, setSettingsOpen] = useState(isUnderSettings);

  return (
    <div className="flex h-full w-64 shrink-0 flex-col bg-neutral-950">
      <div className="flex items-center gap-3 px-6 py-6">
        <Image
          src={siteContent.brand.logo}
          alt={siteContent.brand.name}
          width={40}
          height={40}
          className="h-10 w-10 object-contain"
        />
        <div>
          <p className="text-sm font-bold tracking-widest text-white">GEDO SALON</p>
          <p className="text-[10px] font-medium tracking-widest text-white/40">ADMIN PANEL</p>
        </div>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          if (item.type === "link") {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-white text-black" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          }

          const GroupIcon = item.icon;
          const expanded = settingsOpen;

          return (
            <div key={item.label}>
              <button
                type="button"
                onClick={() => setSettingsOpen((open) => !open)}
                aria-expanded={expanded}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isUnderSettings ? "text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <GroupIcon className="h-[18px] w-[18px]" />
                  {item.label}
                </span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>

              {expanded && (
                <div className="mt-1 flex flex-col gap-1 border-l border-white/10 pl-4">
                  {item.children.map((child) => {
                    const isChildActive = pathname.startsWith(child.href);
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                          isChildActive ? "bg-white text-black" : "text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <ChildIcon className="h-4 w-4 shrink-0" />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
