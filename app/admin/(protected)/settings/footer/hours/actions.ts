"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { runMutation, runVoidMutation, GENERIC_MUTATION_ERROR } from "@/lib/action-helpers";
import { OpeningHoursSchema, type OpeningHoursFormState } from "@/lib/validation/schemas";

function parseOpeningHoursForm(formData: FormData) {
  return OpeningHoursSchema.safeParse({
    label: formData.get("label"),
    value: formData.get("value"),
    displayOrder: formData.get("displayOrder"),
    isActive: formData.get("isActive") === "on",
  });
}

export async function createOpeningHours(
  _state: OpeningHoursFormState,
  formData: FormData
): Promise<OpeningHoursFormState> {
  await verifySession();

  const validatedFields = parseOpeningHoursForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.opening_hours.create.failed", {}, () =>
    prisma.openingHours.create({ data: validatedFields.data })
  );
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/settings/footer");
  redirect("/admin/settings/footer");
}

export async function updateOpeningHours(
  id: string,
  _state: OpeningHoursFormState,
  formData: FormData
): Promise<OpeningHoursFormState> {
  await verifySession();

  const validatedFields = parseOpeningHoursForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.opening_hours.update.failed", { id }, () =>
    prisma.openingHours.update({ where: { id }, data: validatedFields.data })
  );
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/settings/footer");
  redirect("/admin/settings/footer");
}

export async function deleteOpeningHours(id: string) {
  await verifySession();

  await runVoidMutation("admin.opening_hours.delete.failed", { id }, () =>
    prisma.openingHours.delete({ where: { id } })
  );

  revalidatePath("/");
  revalidatePath("/admin/settings/footer");
}

export async function toggleOpeningHoursActive(id: string, isActive: boolean) {
  await verifySession();

  await runVoidMutation("admin.opening_hours.toggle.failed", { id }, () =>
    prisma.openingHours.update({ where: { id }, data: { isActive } })
  );

  revalidatePath("/");
  revalidatePath("/admin/settings/footer");
}
