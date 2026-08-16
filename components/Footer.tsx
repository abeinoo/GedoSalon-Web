import Image from "next/image";
import { siteContent } from "@/lib/content";
import { socialIconMap, PhoneIcon, MailIcon, WhatsappIcon } from "./icons";

export default function Footer() {
  const { brand, footer } = siteContent;

  return (
    <footer id="contact" className="bg-neutral-950 pt-16 text-neutral-300">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
        <div>
          <Image
            src={brand.logo}
            alt={brand.name}
            width={140}
            height={140}
            className="h-24 w-24 object-contain"
          />
          <p className="mt-4 text-base font-bold tracking-wide text-white">{brand.name}</p>
          <p dir="rtl" lang="ar" className="text-left text-base font-bold text-white">
            {brand.legalName}
          </p>
          <p className="mt-2 max-w-[220px] text-sm text-neutral-400">{brand.tagline}</p>
          <div className="mt-5 flex items-center gap-3">
            {footer.social.map((s) => {
              const Icon = socialIconMap[s.icon];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 text-neutral-300 transition hover:border-white hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-widest text-white">QUICK LINKS</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {footer.quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-neutral-400 transition hover:text-white">
                  {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-widest text-white">CONTACT US</h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-neutral-400">
            <li className="flex items-center gap-2.5">
              <PhoneIcon className="h-4 w-4 shrink-0" />
              {footer.contact.phone}
            </li>
            <li className="flex items-center gap-2.5">
              <WhatsappIcon className="h-4 w-4 shrink-0" />
              <a
                href={footer.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                {footer.contact.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MailIcon className="h-4 w-4 shrink-0" />
              {footer.contact.email}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-widest text-white">OPENING HOURS</h3>
          <ul className="mt-4 flex flex-col gap-4 text-sm text-neutral-400">
            {footer.hours.map((h) => (
              <li key={h.label}>
                <p className="text-neutral-200">{h.label}</p>
                <p>{h.value}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-14 border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        {footer.copyright}
      </div>
    </footer>
  );
}
