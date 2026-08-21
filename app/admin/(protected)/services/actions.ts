"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/uploads";
import { runMutation, runVoidMutation, GENERIC_MUTATION_ERROR } from "@/lib/action-helpers";
import { ServiceSchema, type ServiceFormState } from "@/lib/validation/schemas";

function parseServiceForm(formData: FormData) {
  return ServiceSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    image: formData.get("image"),
    category: formData.get("category"),
    displayOrder: formData.get("displayOrder"),
    isActive: formData.get("isActive") === "on",
  });
}

export async function createService(_state: ServiceFormState, formData: FormData): Promise<ServiceFormState> {
  await verifySession();

  const validatedFields = parseServiceForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.service.create.failed", {}, () =>
    prisma.service.create({ data: validatedFields.data })
  );
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/services");
  revalidatePath("/admin");
  redirect("/admin/services");
}

export async function updateService(
  id: string,
  _state: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await verifySession();

  const validatedFields = parseServiceForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.service.update.failed", { id }, async () => {
    const existing = await prisma.service.findUnique({ where: { id }, select: { image: true } });
    await prisma.service.update({ where: { id }, data: validatedFields.data });
    if (existing && existing.image !== validatedFields.data.image) {
      await deleteUploadedFile(existing.image);
    }
  });
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/services");
  revalidatePath("/admin");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await verifySession();

  await runVoidMutation("admin.service.delete.failed", { id }, async () => {
    const deleted = await prisma.service.delete({ where: { id } });
    await deleteUploadedFile(deleted.image);
  });

  revalidatePath("/");
  revalidatePath("/admin/services");
  revalidatePath("/admin");
}

export async function toggleServiceActive(id: string, isActive: boolean) {
  await verifySession();

  await runVoidMutation("admin.service.toggle.failed", { id }, () =>
    prisma.service.update({ where: { id }, data: { isActive } })
  );

  revalidatePath("/");
  revalidatePath("/admin/services");
}
