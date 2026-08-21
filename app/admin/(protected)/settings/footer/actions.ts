"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { runMutation, GENERIC_MUTATION_ERROR } from "@/lib/action-helpers";
import { FooterSettingsSchema, type FooterSettingsFormState } from "@/lib/validation/schemas";

export async function updateFooterSettings(
  _state: FooterSettingsFormState,
  formData: FormData
): Promise<FooterSettingsFormState> {
  await verifySession();

  const validatedFields = FooterSettingsSchema.safeParse({
    tagline: formData.get("tagline"),
    copyrightText: formData.get("copyrightText"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: "Please fix the errors below." };
  }

  const result = await runMutation("admin.footer_settings.update.failed", {}, () =>
    prisma.footerSettings.upsert({
      where: { id: "main" },
      update: validatedFields.data,
      create: { id: "main", ...validatedFields.data },
    })
  );
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/settings/footer");

  return { message: "Footer settings saved." };
}
