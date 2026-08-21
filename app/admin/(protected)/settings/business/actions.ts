"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { runMutation, GENERIC_MUTATION_ERROR } from "@/lib/action-helpers";
import { BusinessInfoSchema, type BusinessInfoFormState } from "@/lib/validation/schemas";

export async function updateBusinessInfo(
  _state: BusinessInfoFormState,
  formData: FormData
): Promise<BusinessInfoFormState> {
  await verifySession();

  const validatedFields = BusinessInfoSchema.safeParse({
    legalName: formData.get("legalName"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    whatsappNumber: formData.get("whatsappNumber"),
    whatsappHref: formData.get("whatsappHref"),
    email: formData.get("email"),
    website: formData.get("website"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: "Please fix the errors below." };
  }

  const result = await runMutation("admin.business_info.update.failed", {}, () =>
    prisma.businessInfo.upsert({
      where: { id: "main" },
      update: validatedFields.data,
      create: { id: "main", ...validatedFields.data },
    })
  );
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/settings/business");

  return { message: "Business information saved." };
}
