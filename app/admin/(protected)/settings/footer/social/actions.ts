"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { runMutation, runVoidMutation, GENERIC_MUTATION_ERROR } from "@/lib/action-helpers";
import { SocialLinkSchema, type SocialLinkFormState } from "@/lib/validation/schemas";

function parseSocialLinkForm(formData: FormData) {
  return SocialLinkSchema.safeParse({
    platform: formData.get("platform"),
    href: formData.get("href"),
    displayOrder: formData.get("displayOrder"),
    isActive: formData.get("isActive") === "on",
  });
}

export async function createSocialLink(_state: SocialLinkFormState, formData: FormData): Promise<SocialLinkFormState> {
  await verifySession();

  const validatedFields = parseSocialLinkForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.social_link.create.failed", {}, () =>
    prisma.socialLink.create({ data: validatedFields.data })
  );
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/settings/footer");
  redirect("/admin/settings/footer");
}

export async function updateSocialLink(
  id: string,
  _state: SocialLinkFormState,
  formData: FormData
): Promise<SocialLinkFormState> {
  await verifySession();

  const validatedFields = parseSocialLinkForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.social_link.update.failed", { id }, () =>
    prisma.socialLink.update({ where: { id }, data: validatedFields.data })
  );
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/settings/footer");
  redirect("/admin/settings/footer");
}

export async function deleteSocialLink(id: string) {
  await verifySession();

  await runVoidMutation("admin.social_link.delete.failed", { id }, () =>
    prisma.socialLink.delete({ where: { id } })
  );

  revalidatePath("/");
  revalidatePath("/admin/settings/footer");
}

export async function toggleSocialLinkActive(id: string, isActive: boolean) {
  await verifySession();

  await runVoidMutation("admin.social_link.toggle.failed", { id }, () =>
    prisma.socialLink.update({ where: { id }, data: { isActive } })
  );

  revalidatePath("/");
  revalidatePath("/admin/settings/footer");
}
