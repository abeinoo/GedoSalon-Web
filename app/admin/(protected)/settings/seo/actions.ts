"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/uploads";
import { runMutation, GENERIC_MUTATION_ERROR } from "@/lib/action-helpers";
import { SeoSettingsSchema, type SeoSettingsFormState } from "@/lib/validation/schemas";

export async function updateSeoSettings(
  _state: SeoSettingsFormState,
  formData: FormData
): Promise<SeoSettingsFormState> {
  await verifySession();

  const ogImageRaw = formData.get("ogImage");
  const keywordsRaw = formData.get("keywords");

  const validatedFields = SeoSettingsSchema.safeParse({
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    ogImage: ogImageRaw ? ogImageRaw : null,
    keywords: keywordsRaw ? keywordsRaw : null,
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: "Please fix the errors below." };
  }

  const result = await runMutation("admin.seo_settings.update.failed", {}, async () => {
    const existing = await prisma.seoSettings.findUnique({ where: { id: "main" }, select: { ogImage: true } });
    await prisma.seoSettings.upsert({
      where: { id: "main" },
      update: validatedFields.data,
      create: { id: "main", ...validatedFields.data },
    });
    if (existing && existing.ogImage && existing.ogImage !== validatedFields.data.ogImage) {
      await deleteUploadedFile(existing.ogImage);
    }
  });
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/settings/seo");

  return { message: "SEO settings saved." };
}
