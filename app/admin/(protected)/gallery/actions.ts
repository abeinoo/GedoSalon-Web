"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/uploads";
import { runMutation, runVoidMutation, GENERIC_MUTATION_ERROR } from "@/lib/action-helpers";
import { GalleryImageSchema, type GalleryImageFormState } from "@/lib/validation/schemas";

function parseGalleryImageForm(formData: FormData) {
  return GalleryImageSchema.safeParse({
    image: formData.get("image"),
    displayOrder: formData.get("displayOrder"),
    isActive: formData.get("isActive") === "on",
  });
}

export async function createGalleryImage(
  _state: GalleryImageFormState,
  formData: FormData
): Promise<GalleryImageFormState> {
  await verifySession();

  const validatedFields = parseGalleryImageForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.gallery.create.failed", {}, () =>
    prisma.galleryImage.create({ data: validatedFields.data })
  );
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  redirect("/admin/gallery");
}

export async function updateGalleryImage(
  id: string,
  _state: GalleryImageFormState,
  formData: FormData
): Promise<GalleryImageFormState> {
  await verifySession();

  const validatedFields = parseGalleryImageForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.gallery.update.failed", { id }, async () => {
    const existing = await prisma.galleryImage.findUnique({ where: { id }, select: { image: true } });
    await prisma.galleryImage.update({ where: { id }, data: validatedFields.data });
    if (existing && existing.image !== validatedFields.data.image) {
      await deleteUploadedFile(existing.image);
    }
  });
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  redirect("/admin/gallery");
}

export async function deleteGalleryImage(id: string) {
  await verifySession();

  await runVoidMutation("admin.gallery.delete.failed", { id }, async () => {
    const deleted = await prisma.galleryImage.delete({ where: { id } });
    await deleteUploadedFile(deleted.image);
  });

  revalidatePath("/");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
}

export async function toggleGalleryImageActive(id: string, isActive: boolean) {
  await verifySession();

  await runVoidMutation("admin.gallery.toggle.failed", { id }, () =>
    prisma.galleryImage.update({ where: { id }, data: { isActive } })
  );

  revalidatePath("/");
  revalidatePath("/admin/gallery");
}
