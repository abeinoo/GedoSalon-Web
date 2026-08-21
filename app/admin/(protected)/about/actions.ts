"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/uploads";
import { runMutation, GENERIC_MUTATION_ERROR } from "@/lib/action-helpers";
import { AboutSchema, type AboutFormState } from "@/lib/validation/schemas";

export async function updateAbout(_state: AboutFormState, formData: FormData): Promise<AboutFormState> {
  await verifySession();

  const validatedFields = AboutSchema.safeParse({
    label: formData.get("label"),
    title: formData.get("title"),
    description: formData.get("description"),
    secondaryDescription: formData.get("secondaryDescription"),
    image: formData.get("image"),
    buttonText: formData.get("buttonText"),
    buttonUrl: formData.get("buttonUrl"),
    isActive: formData.get("isActive") === "on",
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: "Please fix the errors below." };
  }

  const result = await runMutation("admin.about.update.failed", {}, async () => {
    const existing = await prisma.aboutContent.findUnique({ where: { id: "main" }, select: { image: true } });
    await prisma.aboutContent.upsert({
      where: { id: "main" },
      update: validatedFields.data,
      create: { id: "main", ...validatedFields.data },
    });
    if (existing && existing.image !== validatedFields.data.image) {
      await deleteUploadedFile(existing.image);
    }
  });
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/about");
  revalidatePath("/admin");

  return { message: "About Us content saved." };
}
