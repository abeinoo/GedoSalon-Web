// Central content/data layer for the site.
//
// Every image referenced here is a plain path string (currently pointing at
// generated placeholder art under /public/images/placeholders). Swapping in
// real assets — whether uploaded through a future Admin Panel or written to
// a database — only ever means changing the values in this file (or, later,
// swapping this module for a function that fetches the same shape from a
// CMS/DB). No component below imports an image directly.

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "HOME", href: "#home" },
  { label: "SERVICES", href: "#services" },
  { label: "BARBERS", href: "#barbers" },
  { label: "BRANCHES", href: "#branches" },
  { label: "OFFERS", href: "#offers" },
  { label: "GALLERY", href: "#gallery" },
  { label: "ABOUT US", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

// Fresha booking page — shared by the Navbar "BOOK NOW" button and the
// generic "book now" CTAs on Services/Offers. The Hero section has its own
// admin-editable button URL (HeroContent.ctaHref) and may point elsewhere.
export const bookingHref = "https://www.fresha.com/book-now/gedo-salon-pqeq5k4i/services?share=true&pId=564827";

export const siteContent = {
  brand: {
    name: "Gedo Salon",
    // White/transparent glow variant — used on navbar & footer, both over
    // dark backgrounds. Swap this path to change the logo everywhere at once.
    logo: "/gedo-logo-white.png",
  },

  services: {
    title: "OUR SERVICES",
    items: [
      { icon: "scissors", title: "HAIRCUT" },
      { icon: "beard", title: "BEARD" },
      { icon: "facial", title: "FACIAL" },
      { icon: "bottle", title: "HAIR TREATMENT" },
      { icon: "manicure", title: "MANICURE & PEDICURE" },
      { icon: "kid", title: "KIDS HAIRCUT" },
    ] as const,
  },

  barbers: {
    title: "OUR BARBERS",
  },

  offers: {
    label: "SPECIAL OFFERS",
    title: "Exclusive Offers",
    subtitle:
      "Gedo Salon brings you special offers and experiences designed to make every visit feel more rewarding.",
    viewAllLabel: "VIEW ALL OFFERS",
    viewAllHref: "#offers",
    items: [
      {
        title: "Gedo Gathering",
        description: "Enjoy a special experience when you visit with your friends.",
        value: "Up to 40% OFF",
        ctaLabel: "CLAIM OFFER",
        ctaHref: "#contact",
        image: "/images/placeholders/offer-1.svg",
      },
      {
        title: "Kids Haircut",
        description: "A special haircut experience for our little gentlemen.",
        value: "50% OFF",
        ctaLabel: "CLAIM OFFER",
        ctaHref: "#contact",
        image: "/images/placeholders/offer-2.svg",
      },
      {
        title: "Morning Special",
        description: "Enjoy your grooming experience during our morning hours.",
        value: "30% OFF",
        ctaLabel: "CLAIM OFFER",
        ctaHref: "#contact",
        image: "/images/placeholders/offer-3.svg",
      },
    ],
  },

  branches: {
    title: "OUR BRANCHES",
  },

  features: {
    items: [
      { icon: "badge", title: "PREMIUM QUALITY", desc: "We use top quality products for the best results." },
      { icon: "clock", title: "ON TIME", desc: "We respect your time and your appointment." },
      { icon: "chair", title: "EXPERT BARBERS", desc: "Professional barbers with years of experience." },
      { icon: "star", title: "BEST EXPERIENCE", desc: "It's not just a look, It's a feeling." },
    ] as const,
  },

  gallery: {
    title: "OUR WORK",
  },
};

export type SiteContent = typeof siteContent;
