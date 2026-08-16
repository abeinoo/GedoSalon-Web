import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function ScissorsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <line x1="8.2" y1="7.5" x2="20" y2="17" />
      <line x1="8.2" y1="16.5" x2="20" y2="7" />
    </svg>
  );
}

export function BeardIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4c0 2 .5 3 1 4" />
      <path d="M17 4c0 2-.5 3-1 4" />
      <path d="M6 8c0 6 1.5 8 2.5 9.5C9.7 19.3 10.8 20 12 20s2.3-.7 3.5-2.5C16.5 16 18 14 18 8" />
      <path d="M6 8c1-1.2 2.4-2 6-2s5 .8 6 2" />
      <path d="M9.5 14.5c.8 1 1.6 1.5 2.5 1.5s1.7-.5 2.5-1.5" />
    </svg>
  );
}

export function FacialIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 3.5c-2 .8-3 2.8-3 5.5 0 4.5 2.8 8 7 8s7-3.5 7-8c0-2.7-1-4.7-3-5.5" />
      <path d="M8 3.5C9 3 10.3 3 12 3s3 0 4 .5" />
      <path d="M9.5 12.5c.7.6 1.5 1 2.5 1s1.8-.4 2.5-1" />
      <line x1="9" y1="9" x2="9" y2="9.01" />
      <line x1="15" y1="9" x2="15" y2="9.01" />
    </svg>
  );
}

export function BottleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 2h4" />
      <path d="M10.5 2v2.8c0 .5-.2.9-.5 1.3L8.7 7.7c-.4.5-.7 1.2-.7 1.9V19a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9.6c0-.7-.3-1.4-.7-1.9l-1.3-1.6c-.3-.4-.5-.8-.5-1.3V2" />
      <line x1="8.2" y1="12" x2="15.8" y2="12" />
    </svg>
  );
}

export function ManicureIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="10.5" y="2.5" width="3" height="9" rx="1.5" />
      <path d="M7 21c0-4 2-6.5 5-6.5s5 2.5 5 6.5" />
      <line x1="4.5" y1="21" x2="19.5" y2="21" />
    </svg>
  );
}

export function KidIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="11" r="6" />
      <path d="M7 8c1-1.5 2.5-2.5 5-2.5s4 1 5 2.5" />
      <path d="M9.5 12c.6.6 1.5 1 2.5 1s1.9-.4 2.5-1" />
      <path d="M9 20.5c1-1 2-1.5 3-1.5s2 .5 3 1.5" />
    </svg>
  );
}

export function BadgeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.5l2.2 1.6 2.7-.1.9 2.5 2.3 1.4-.9 2.6.9 2.6-2.3 1.4-.9 2.5-2.7-.1L12 21.5l-2.2-1.6-2.7.1-.9-2.5-2.3-1.4.9-2.6-.9-2.6 2.3-1.4.9-2.5 2.7.1z" />
      <path d="M8.7 12.2l2.1 2.1 4.2-4.4" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function ChairIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 4h8l-1 8" />
      <path d="M6 4v9" />
      <path d="M4 13h9a2 2 0 0 1 2 2v1H6a2 2 0 0 1-2-2z" />
      <path d="M8 16v2.5M12.5 16v2.5" />
      <path d="M6 20.5h9" />
      <path d="M17 9c1.7 0 3 1.1 3 2.6 0 1.2-.8 2-2 2.4" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-6.5-5.8-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.2-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="14 6 20 12 14 18" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="15 6 9 12 15 18" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 4h3.2l1.3 4-2 1.4a12 12 0 0 0 5.1 5.1l1.4-2 4 1.3V17a2 2 0 0 1-2 2C10.5 19 3 11.5 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M4 6.5l8 6.5 8-6.5" />
    </svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
      <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.2-.4-4.5-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14 9.5V7.7c0-.8.5-1 .9-1H17V3.5l-2.9 0c-3.2 0-3.9 2.4-3.9 3.9v2.1H8.3v3.2h1.9V21h3.8v-8.3h2.6l.4-3.2H14z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="16.7" y1="7.3" x2="16.71" y2="7.3" />
    </svg>
  );
}

export function TiktokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 3c.4 2.2 1.8 3.6 4 3.9v2.7c-1.4 0-2.7-.4-3.9-1.2v6.4a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v2.8a2.7 2.7 0 1 0 1.9 2.6V3z" />
    </svg>
  );
}

export const serviceIconMap = {
  scissors: ScissorsIcon,
  beard: BeardIcon,
  facial: FacialIcon,
  bottle: BottleIcon,
  manicure: ManicureIcon,
  kid: KidIcon,
};

export const featureIconMap = {
  badge: BadgeIcon,
  clock: ClockIcon,
  chair: ChairIcon,
  star: StarIcon,
};

export const socialIconMap = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  whatsapp: WhatsappIcon,
};
