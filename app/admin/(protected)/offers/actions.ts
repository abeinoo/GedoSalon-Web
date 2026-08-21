"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/uploads";
import { runMutation, runVoidMutation, GENERIC_MUTATION_ERROR } from "@/lib/action-helpers";
import { OfferSchema, type OfferFormState } from "@/lib/validation/schemas";

function parseOfferForm(formData: FormData) {
  const priceRaw = formData.get("price");
  const startDateRaw = formData.get("startDate");
  const endDateRaw = formData.get("endDate");

  return OfferSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    discount: formData.get("discount"),
    price: priceRaw ? priceRaw : null,
    image: formData.get("image"),
    startDate: startDateRaw ? startDateRaw : null,
    endDate: endDateRaw ? endDateRaw : null,
    displayOrder: formData.get("displayOrder"),
    isActive: formData.get("isActive") === "on",
  });
}

function toPrismaData(data: ReturnType<typeof OfferSchema.parse>) {
  return {
    ...data,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
  };
}

export async function createOffer(_state: OfferFormState, formData: FormData): Promise<OfferFormState> {
  await verifySession();

  const validatedFields = parseOfferForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.offer.create.failed", {}, () =>
    prisma.offer.create({ data: toPrismaData(validatedFields.data) })
  );
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/offers");
  revalidatePath("/admin");
  redirect("/admin/offers");
}

export async function updateOffer(id: string, _state: OfferFormState, formData: FormData): Promise<OfferFormState> {
  await verifySession();

  const validatedFields = parseOfferForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.offer.update.failed", { id }, async () => {
    const existing = await prisma.offer.findUnique({ where: { id }, select: { image: true } });
    await prisma.offer.update({ where: { id }, data: toPrismaData(validatedFields.data) });
    if (existing && existing.image !== validatedFields.data.image) {
      await deleteUploadedFile(existing.image);
    }
  });
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/offers");
  revalidatePath("/admin");
  redirect("/admin/offers");
}

export async function deleteOffer(id: string) {
  await verifySession();

  await runVoidMutation("admin.offer.delete.failed", { id }, async () => {
    const deleted = await prisma.offer.delete({ where: { id } });
    await deleteUploadedFile(deleted.image);
  });

  revalidatePath("/");
  revalidatePath("/admin/offers");
  revalidatePath("/admin");
}

export async function toggleOfferActive(id: string, isActive: boolean) {
  await verifySession();

  await runVoidMutation("admin.offer.toggle.failed", { id }, () =>
    prisma.offer.update({ where: { id }, data: { isActive } })
  );

  revalidatePath("/");
  revalidatePath("/admin/offers");
}
