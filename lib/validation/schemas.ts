import * as z from "zod";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/constants";

// --- Shared field builders -------------------------------------------------
// Every admin-entered text field gets a reasonable max length (defense in
// depth against pathologically large payloads — Zod runs before anything
// touches the database). Fields backed by a <textarea> additionally
// normalize CRLF line endings to LF: browsers normalize textarea values to
// "\r\n" on form submission per the HTML spec, and code that later splits
// stored text on "\n" (e.g. BusinessInfo.address) would otherwise pick up a
// stray trailing "\r" on every line but the last.

function normalizeMultiline(value: string) {
  return value.replace(/\r\n/g, "\n");
}

function shortText(message: string, max = 200) {
  return z.string().trim().min(1, { error: message }).max(max, { error: `Must be ${max} characters or fewer.` });
}

function longText(message: string, max = 4000) {
  return z
    .string()
    .trim()
    .min(1, { error: message })
    .max(max, { error: `Must be ${max} characters or fewer.` })
    .transform(normalizeMultiline);
}

function optionalLongText(max = 4000) {
  return z
    .string()
    .trim()
    .max(max, { error: `Must be ${max} characters or fewer.` })
    .transform(normalizeMultiline)
    .nullable();
}

function urlText(message: string, max = 2048) {
  return z.string().trim().min(1, { error: message }).max(max, { error: `Must be ${max} characters or fewer.` });
}

const imagePathSchema = z
  .string()
  .trim()
  .min(1, { error: "An image is required." })
  .max(500, { error: "Image path is too long." });

// --- Auth -------------------------------------------------------------------

export const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email." }).trim().max(254),
  password: z.string().min(1, { error: "Password is required." }).max(200),
});

export type LoginFormState =
  | {
      errors?: { email?: string[]; password?: string[] };
      message?: string;
    }
  | undefined;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: "Current password is required." }).max(200),
    newPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, { error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` })
      .max(200, { error: "New password must be 200 characters or fewer." }),
    confirmPassword: z.string().min(1, { error: "Please confirm the new password." }).max(200),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "New password and confirmation don't match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    error: "New password must be different from the current password.",
    path: ["newPassword"],
  });

export type ChangePasswordFormState =
  | {
      errors?: Partial<Record<"currentPassword" | "newPassword" | "confirmPassword", string[]>>;
      message?: string;
    }
  | undefined;

// --- About -------------------------------------------------------------------

export const AboutSchema = z.object({
  label: shortText("Section label is required."),
  title: shortText("Title is required."),
  description: longText("Description is required."),
  secondaryDescription: longText("Secondary description is required."),
  image: imagePathSchema,
  buttonText: shortText("Button text is required."),
  buttonUrl: urlText("Button URL is required."),
  isActive: z.boolean(),
});

export type AboutFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof AboutSchema>, string[]>>;
      message?: string;
    }
  | undefined;

// --- Services -------------------------------------------------------------------

export const ServiceSchema = z.object({
  name: shortText("Name is required."),
  description: longText("Description is required."),
  price: z.coerce.number({ error: "Price must be a number." }).nonnegative({ error: "Price can't be negative." }).max(10_000_000),
  image: imagePathSchema,
  category: shortText("Category is required."),
  displayOrder: z.coerce.number({ error: "Display order must be a number." }).int(),
  isActive: z.boolean(),
});

export type ServiceFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof ServiceSchema>, string[]>>;
      message?: string;
    }
  | undefined;

// --- Offers -------------------------------------------------------------------

export const OfferSchema = z
  .object({
    title: shortText("Title is required."),
    description: longText("Description is required."),
    discount: shortText("Discount is required.", 100),
    price: z.coerce.number({ error: "Price must be a number." }).nonnegative().max(10_000_000).nullable(),
    image: imagePathSchema,
    startDate: z.string().trim().max(40).nullable(),
    endDate: z.string().trim().max(40).nullable(),
    displayOrder: z.coerce.number({ error: "Display order must be a number." }).int(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => !data.startDate || !data.endDate || new Date(data.startDate) <= new Date(data.endDate),
    { error: "End date must be on or after the start date.", path: ["endDate"] }
  );

export type OfferFormState =
  | {
      errors?: Partial<Record<"title" | "description" | "discount" | "price" | "image" | "startDate" | "endDate" | "displayOrder" | "isActive", string[]>>;
      message?: string;
    }
  | undefined;

// --- Hero -------------------------------------------------------------------

export const HeroSchema = z.object({
  label: shortText("Label is required."),
  headingLine1: shortText("First heading line is required.", 60),
  headingLine2: shortText("Second heading line is required.", 60),
  subtitle: shortText("Subtitle is required.", 300),
  ctaLabel: shortText("Button text is required.", 60),
  ctaHref: urlText("Button URL is required."),
  image: imagePathSchema,
});

export type HeroFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof HeroSchema>, string[]>>;
      message?: string;
    }
  | undefined;

// --- Business info -------------------------------------------------------------------

export const BusinessInfoSchema = z.object({
  legalName: shortText("Legal business name is required.", 300),
  address: longText("Address is required.", 1000),
  phone: shortText("Phone is required.", 60),
  whatsappNumber: shortText("WhatsApp number is required.", 60),
  whatsappHref: urlText("WhatsApp link is required."),
  email: z.email({ error: "Enter a valid email." }).trim().max(254),
  website: urlText("Website is required."),
});

export type BusinessInfoFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof BusinessInfoSchema>, string[]>>;
      message?: string;
    }
  | undefined;

// --- Footer -------------------------------------------------------------------

export const FooterSettingsSchema = z.object({
  tagline: shortText("Tagline is required.", 300),
  copyrightText: shortText("Copyright text is required.", 300),
});

export type FooterSettingsFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof FooterSettingsSchema>, string[]>>;
      message?: string;
    }
  | undefined;

// --- SEO -------------------------------------------------------------------

export const SeoSettingsSchema = z.object({
  metaTitle: shortText("Meta title is required.", 200),
  metaDescription: longText("Meta description is required.", 500),
  ogImage: z.string().trim().max(500).nullable(),
  keywords: optionalLongText(500),
});

export type SeoSettingsFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof SeoSettingsSchema>, string[]>>;
      message?: string;
    }
  | undefined;

// --- Social links -------------------------------------------------------------------

export const SOCIAL_PLATFORMS = ["facebook", "instagram", "tiktok", "whatsapp"] as const;

export const SocialLinkSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS, { error: "Choose a platform." }),
  href: urlText("Link is required."),
  displayOrder: z.coerce.number({ error: "Display order must be a number." }).int(),
  isActive: z.boolean(),
});

export type SocialLinkFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof SocialLinkSchema>, string[]>>;
      message?: string;
    }
  | undefined;

// --- Opening hours -------------------------------------------------------------------

export const OpeningHoursSchema = z.object({
  label: shortText("Label is required.", 100),
  value: shortText("Hours are required.", 100),
  displayOrder: z.coerce.number({ error: "Display order must be a number." }).int(),
  isActive: z.boolean(),
});

export type OpeningHoursFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof OpeningHoursSchema>, string[]>>;
      message?: string;
    }
  | undefined;

// --- Branches -------------------------------------------------------------------

export const BranchSchema = z.object({
  name: shortText("Name is required."),
  location: shortText("Location is required.", 300),
  image: imagePathSchema,
  displayOrder: z.coerce.number({ error: "Display order must be a number." }).int(),
  isActive: z.boolean(),
});

export type BranchFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof BranchSchema>, string[]>>;
      message?: string;
    }
  | undefined;

// --- Barbers -------------------------------------------------------------------

export const BarberSchema = z.object({
  name: shortText("Name is required."),
  title: shortText("Title is required."),
  image: imagePathSchema,
  bookHref: urlText("Booking link is required."),
  displayOrder: z.coerce.number({ error: "Display order must be a number." }).int(),
  isActive: z.boolean(),
});

export type BarberFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof BarberSchema>, string[]>>;
      message?: string;
    }
  | undefined;

// --- Gallery -------------------------------------------------------------------

export const GalleryImageSchema = z.object({
  image: imagePathSchema,
  displayOrder: z.coerce.number({ error: "Display order must be a number." }).int(),
  isActive: z.boolean(),
});

export type GalleryImageFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof GalleryImageSchema>, string[]>>;
      message?: string;
    }
  | undefined;
