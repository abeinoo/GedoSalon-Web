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

export const siteContent = {
  brand: {
    name: "Gedo Salon",
    // Official registered Arabic business name — shown in the footer and
    // About section for business/identity verification purposes.
    legalName: "جدو للعناية بالشعر للرجال",
    // White/transparent glow variant — used on navbar & footer, both over
    // dark backgrounds. Swap this path to change the logo everywhere at once.
    logo: "/gedo-logo-white.png",
    tagline: "It's not just a look, It's a feeling.",
  },

  hero: {
    label: "PREMIUM MEN'S GROOMING",
    headingLines: ["GEDO", "SALON"],
    subtitle: "It's not just a look, It's a feeling.",
    ctaLabel: "BOOK YOUR APPOINTMENT",
    // Fresha booking page — used by both the Navbar "BOOK NOW" button and
    // this Hero "BOOK YOUR APPOINTMENT" button (both read this same field).
    ctaHref: "https://www.fresha.com/book-now/gedo-salon-pqeq5k4i/services?share=true&pId=564827",
    image: "/images/hero-salon-interior.png",
  },

  services: {
    title: "OUR SERVICES",
    viewAllLabel: "VIEW ALL SERVICES",
    viewAllHref: "#services",
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
    viewAllLabel: "VIEW ALL BARBERS",
    viewAllHref: "#barbers",
    items: [
      { name: "HISHAM", title: "Senior Barber", image: "/images/placeholders/barber-1.svg", bookHref: "#contact" },
      { name: "MAHMOUD", title: "Master Groomer", image: "/images/placeholders/barber-2.svg", bookHref: "#contact" },
      { name: "MOHAMED", title: "Stylist", image: "/images/placeholders/barber-3.svg", bookHref: "#contact" },
      { name: "AHMED", title: "Barber", image: "/images/placeholders/barber-4.svg", bookHref: "#contact" },
      { name: "OMAR", title: "Barber", image: "/images/placeholders/barber-5.svg", bookHref: "#contact" },
      { name: "YASSER", title: "Beard Specialist", image: "/images/placeholders/barber-6.svg", bookHref: "#contact" },
    ],
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

  about: {
    label: "ABOUT GEDO",
    title: "It's Not Just a Look, It's a Feeling.",
    paragraphs: [
      "Gedo Salon is more than a barbershop. It's a place where grooming, style, and attention to detail come together to create a complete experience.",
      "Our goal is simple — to make every visit comfortable, professional, and memorable. From classic barbering to modern grooming and skincare, every detail is designed around our clients.",
    ],
    ctaLabel: "DISCOVER GEDO",
    ctaHref: "#about",
    image: "/images/about-grooming-station.png",
    // Official business details, shown for identity/location verification
    // (e.g. Meta/Facebook business verification).
    businessInfo: {
      legalNameLabel: "Legal Business Name",
      legalName: "جدو للعناية بالشعر للرجال",
      addressLabel: "Address",
      addressLines: [
        "١٨ ٠٠٠ش محمد حسن الجمل",
        "منطقة ٦، مدينة نصر",
        "Cairo, Nasr City 11231",
        "Egypt",
      ],
      phoneLabel: "Business Phone",
      phone: "+20 121 266 6641",
      websiteLabel: "Website",
      website: "https://www.gedosalons.com/",
    },
  },

  branches: {
    title: "OUR BRANCHES",
    viewAllLabel: "VIEW ALL BRANCHES",
    viewAllHref: "#branches",
    items: [
      { name: "SHUBRA BRANCH", location: "Shubra, Cairo", image: "/images/placeholders/branch-1.svg" },
      { name: "TERAA BRANCH", location: "Teraa El Bolakia, Cairo", image: "/images/placeholders/branch-2.svg" },
      { name: "NASR CITY BRANCH", location: "Nasr City, Cairo", image: "/images/placeholders/branch-3.svg" },
      { name: "SAHEL BRANCH", location: "Sahel, Cairo", image: "/images/placeholders/branch-4.svg" },
    ],
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
    viewAllLabel: "VIEW GALLERY",
    viewAllHref: "#gallery",
    images: [
      "/images/placeholders/gallery-1.svg",
      "/images/placeholders/gallery-2.svg",
      "/images/placeholders/gallery-3.svg",
      "/images/placeholders/gallery-4.svg",
      "/images/placeholders/gallery-5.svg",
      "/images/placeholders/gallery-6.svg",
    ],
  },

  footer: {
    quickLinks: navLinks,
    contact: {
      phone: "012 12666641",
      whatsapp: "+20 12 12666641",
      // Actual click destination for the WhatsApp contact entry — kept
      // separate from the displayed number above.
      whatsappHref: "https://wa.me/gedosalon",
      email: "info@gedosalons.com",
    },
    social: [
      { icon: "facebook", href: "https://www.facebook.com/gedosalon", label: "Facebook" },
      { icon: "instagram", href: "https://www.instagram.com/gedosalon/?hl=en", label: "Instagram" },
      { icon: "tiktok", href: "#", label: "TikTok" },
      { icon: "whatsapp", href: "https://wa.me/gedosalon", label: "WhatsApp" },
    ] as const,
    hours: [
      { label: "Sunday - Thursday", value: "10:00 AM - 12:00 AM" },
      { label: "Friday", value: "2:00 PM - 12:00 AM" },
      { label: "Saturday", value: "10:00 AM - 12:00 AM" },
    ],
    copyright: "© 2026 Gedo Salon. All rights reserved.",
  },
};

export type SiteContent = typeof siteContent;
