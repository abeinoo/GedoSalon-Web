"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/uploads";
import { runMutation, runVoidMutation, GENERIC_MUTATION_ERROR } from "@/lib/action-helpers";
import { BarberSchema, type BarberFormState } from "@/lib/validation/schemas";

function parseBarberForm(formData: FormData) {
  return BarberSchema.safeParse({
    name: formData.get("name"),
    title: formData.get("title"),
    image: formData.get("image"),
    bookHref: formData.get("bookHref"),
    displayOrder: formData.get("displayOrder"),
    isActive: formData.get("isActive") === "on",
  });
}

export async function createBarber(_state: BarberFormState, formData: FormData): Promise<BarberFormState> {
  await verifySession();

  const validatedFields = parseBarberForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.barber.create.failed", {}, () =>
    prisma.barber.create({ data: validatedFields.data })
  );
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/barbers");
  revalidatePath("/admin");
  redirect("/admin/barbers");
}

export async function updateBarber(id: string, _state: BarberFormState, formData: FormData): Promise<BarberFormState> {
  await verifySession();

  const validatedFields = parseBarberForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.barber.update.failed", { id }, async () => {
    const existing = await prisma.barber.findUnique({ where: { id }, select: { image: true } });
    await prisma.barber.update({ where: { id }, data: validatedFields.data });
    if (existing && existing.image !== validatedFields.data.image) {
      await deleteUploadedFile(existing.image);
    }
  });
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/barbers");
  revalidatePath("/admin");
  redirect("/admin/barbers");
}

export async function deleteBarber(id: string) {
  await verifySession();

  await runVoidMutation("admin.barber.delete.failed", { id }, async () => {
    const deleted = await prisma.barber.delete({ where: { id } });
    await deleteUploadedFile(deleted.image);
  });

  revalidatePath("/");
  revalidatePath("/admin/barbers");
  revalidatePath("/admin");
}

export async function toggleBarberActive(id: string, isActive: boolean) {
  await verifySession();

  await runVoidMutation("admin.barber.toggle.failed", { id }, () =>
    prisma.barber.update({ where: { id }, data: { isActive } })
  );

  revalidatePath("/");
  revalidatePath("/admin/barbers");
}
