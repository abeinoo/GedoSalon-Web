"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/uploads";
import { runMutation, GENERIC_MUTATION_ERROR } from "@/lib/action-helpers";
import { HeroSchema, type HeroFormState } from "@/lib/validation/schemas";

export async function updateHero(_state: HeroFormState, formData: FormData): Promise<HeroFormState> {
  await verifySession();

  const validatedFields = HeroSchema.safeParse({
    label: formData.get("label"),
    headingLine1: formData.get("headingLine1"),
    headingLine2: formData.get("headingLine2"),
    subtitle: formData.get("subtitle"),
    ctaLabel: formData.get("ctaLabel"),
    ctaHref: formData.get("ctaHref"),
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: "Please fix the errors below." };
  }

  const result = await runMutation("admin.hero.update.failed", {}, async () => {
    const existing = await prisma.heroContent.findUnique({ where: { id: "hero" }, select: { image: true } });
    await prisma.heroContent.upsert({
      where: { id: "hero" },
      update: validatedFields.data,
      create: { id: "hero", ...validatedFields.data },
    });
    if (existing && existing.image !== validatedFields.data.image) {
      await deleteUploadedFile(existing.image);
    }
  });
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/hero");

  return { message: "Homepage content saved." };
}
