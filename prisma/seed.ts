import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hashPassword } from "../lib/auth/password";
import { MIN_PASSWORD_LENGTH } from "../lib/auth/constants";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const DEV_FALLBACK_PASSWORD = "ChangeMe123!";

function resolveAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;

  if (password) {
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    }
    return password;
  }

  // No hardcoded production fallback: a known default password checked
  // into source control is a real compromise path (see Phase 3.5 review).
  // Local development is the one place a convenience fallback is safe,
  // since dev.db never holds real customer/business data.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_PASSWORD environment variable is required when NODE_ENV=production. " +
        "Set it before running `prisma db seed` — there is no default in production."
    );
  }

  console.log(`No ADMIN_PASSWORD set — using local development default "${DEV_FALLBACK_PASSWORD}". Change it after first login.`);
  return DEV_FALLBACK_PASSWORD;
}

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@gedosalons.com";
  const password = resolveAdminPassword();

  const passwordHash = await hashPassword(password);
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });

  console.log(`Admin user ready: ${email}`);

  await prisma.aboutContent.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      label: "ABOUT GEDO",
      title: "It's Not Just a Look, It's a Feeling.",
      description:
        "Gedo Salon is more than a barbershop. It's a place where grooming, style, and attention to detail come together to create a complete experience.",
      secondaryDescription:
        "Our goal is simple — to make every visit comfortable, professional, and memorable. From classic barbering to modern grooming and skincare, every detail is designed around our clients.",
      image: "/images/about-grooming-station.png",
      buttonText: "DISCOVER GEDO",
      buttonUrl: "#about",
      isActive: true,
    },
  });

  console.log("About Us content seeded.");

  await prisma.heroContent.upsert({
    where: { id: "hero" },
    update: {},
    create: {
      id: "hero",
      label: "PREMIUM MEN'S GROOMING",
      headingLine1: "GEDO",
      headingLine2: "SALON",
      subtitle: "It's not just a look, It's a feeling.",
      ctaLabel: "BOOK YOUR APPOINTMENT",
      ctaHref: "https://www.fresha.com/book-now/gedo-salon-pqeq5k4i/services?share=true&pId=564827",
      image: "/images/hero-salon-interior.png",
    },
  });
  console.log("Hero content seeded.");

  await prisma.businessInfo.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      legalName: "جدو للعناية بالشعر للرجال",
      address: "١٨ ٠٠٠ش محمد حسن الجمل منطقه ٦ م نصر\nCairo, Nasr City 11231\nEgypt",
      phone: "+201212666641",
      whatsappNumber: "+20 121 266 6641",
      whatsappHref: "https://wa.me/201212666641",
      email: "info@gedosalons.com",
      website: "https://www.gedosalons.com/",
    },
  });
  console.log("Business info seeded.");

  await prisma.footerSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      tagline: "It's not just a look, It's a feeling.",
      copyrightText: "© 2026 Gedo Salon. All rights reserved.",
    },
  });
  console.log("Footer settings seeded.");

  await prisma.seoSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      metaTitle: "Gedo Salon | Premium Men's Grooming",
      metaDescription: "It's not just a look, It's a feeling. Premium men's grooming and barbershop in Cairo.",
      ogImage: "/images/hero-salon-interior.png",
      keywords: "gedo salon, men's grooming, barbershop, Cairo, Nasr City",
    },
  });
  console.log("SEO settings seeded.");

  if ((await prisma.socialLink.count()) === 0) {
    await prisma.socialLink.createMany({
      data: [
        { platform: "facebook", href: "https://www.facebook.com/gedosalon", displayOrder: 0 },
        { platform: "instagram", href: "https://www.instagram.com/gedosalon/?hl=en", displayOrder: 1 },
        { platform: "tiktok", href: "#", displayOrder: 2 },
        { platform: "whatsapp", href: "https://wa.me/gedosalon", displayOrder: 3 },
      ],
    });
    console.log("Social links seeded.");
  }

  if ((await prisma.openingHours.count()) === 0) {
    await prisma.openingHours.createMany({
      data: [
        { label: "Sunday - Thursday", value: "10:00 AM - 12:00 AM", displayOrder: 0 },
        { label: "Friday", value: "2:00 PM - 12:00 AM", displayOrder: 1 },
        { label: "Saturday", value: "10:00 AM - 12:00 AM", displayOrder: 2 },
      ],
    });
    console.log("Opening hours seeded.");
  }

  if ((await prisma.branch.count()) === 0) {
    await prisma.branch.createMany({
      data: [
        { name: "SHUBRA BRANCH", location: "Shubra, Cairo", image: "/images/placeholders/branch-1.svg", displayOrder: 0 },
        { name: "TERAA BRANCH", location: "Teraa El Bolakia, Cairo", image: "/images/placeholders/branch-2.svg", displayOrder: 1 },
        { name: "NASR CITY BRANCH", location: "Nasr City, Cairo", image: "/images/placeholders/branch-3.svg", displayOrder: 2 },
        { name: "SAHEL BRANCH", location: "Sahel, Cairo", image: "/images/placeholders/branch-4.svg", displayOrder: 3 },
      ],
    });
    console.log("Branches seeded.");
  }

  if ((await prisma.barber.count()) === 0) {
    await prisma.barber.createMany({
      data: [
        { name: "HISHAM", title: "Senior Barber", image: "/images/placeholders/barber-1.svg", bookHref: "#contact", displayOrder: 0 },
        { name: "MAHMOUD", title: "Master Groomer", image: "/images/placeholders/barber-2.svg", bookHref: "#contact", displayOrder: 1 },
        { name: "MOHAMED", title: "Stylist", image: "/images/placeholders/barber-3.svg", bookHref: "#contact", displayOrder: 2 },
        { name: "AHMED", title: "Barber", image: "/images/placeholders/barber-4.svg", bookHref: "#contact", displayOrder: 3 },
        { name: "OMAR", title: "Barber", image: "/images/placeholders/barber-5.svg", bookHref: "#contact", displayOrder: 4 },
        { name: "YASSER", title: "Beard Specialist", image: "/images/placeholders/barber-6.svg", bookHref: "#contact", displayOrder: 5 },
      ],
    });
    console.log("Barbers seeded.");
  }

  if ((await prisma.galleryImage.count()) === 0) {
    await prisma.galleryImage.createMany({
      data: [
        "/images/placeholders/gallery-1.svg",
        "/images/placeholders/gallery-2.svg",
        "/images/placeholders/gallery-3.svg",
        "/images/placeholders/gallery-4.svg",
        "/images/placeholders/gallery-5.svg",
        "/images/placeholders/gallery-6.svg",
      ].map((image, i) => ({ image, displayOrder: i })),
    });
    console.log("Gallery images seeded.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
