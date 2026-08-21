"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/uploads";
import { runMutation, runVoidMutation, GENERIC_MUTATION_ERROR } from "@/lib/action-helpers";
import { BranchSchema, type BranchFormState } from "@/lib/validation/schemas";

function parseBranchForm(formData: FormData) {
  return BranchSchema.safeParse({
    name: formData.get("name"),
    location: formData.get("location"),
    image: formData.get("image"),
    displayOrder: formData.get("displayOrder"),
    isActive: formData.get("isActive") === "on",
  });
}

export async function createBranch(_state: BranchFormState, formData: FormData): Promise<BranchFormState> {
  await verifySession();

  const validatedFields = parseBranchForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.branch.create.failed", {}, () =>
    prisma.branch.create({ data: validatedFields.data })
  );
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/branches");
  revalidatePath("/admin");
  redirect("/admin/branches");
}

export async function updateBranch(id: string, _state: BranchFormState, formData: FormData): Promise<BranchFormState> {
  await verifySession();

  const validatedFields = parseBranchForm(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const result = await runMutation("admin.branch.update.failed", { id }, async () => {
    const existing = await prisma.branch.findUnique({ where: { id }, select: { image: true } });
    await prisma.branch.update({ where: { id }, data: validatedFields.data });
    if (existing && existing.image !== validatedFields.data.image) {
      await deleteUploadedFile(existing.image);
    }
  });
  if (!result.ok) return { message: GENERIC_MUTATION_ERROR };

  revalidatePath("/");
  revalidatePath("/admin/branches");
  revalidatePath("/admin");
  redirect("/admin/branches");
}

export async function deleteBranch(id: string) {
  await verifySession();

  await runVoidMutation("admin.branch.delete.failed", { id }, async () => {
    const deleted = await prisma.branch.delete({ where: { id } });
    await deleteUploadedFile(deleted.image);
  });

  revalidatePath("/");
  revalidatePath("/admin/branches");
  revalidatePath("/admin");
}

export async function toggleBranchActive(id: string, isActive: boolean) {
  await verifySession();

  await runVoidMutation("admin.branch.toggle.failed", { id }, () =>
    prisma.branch.update({ where: { id }, data: { isActive } })
  );

  revalidatePath("/");
  revalidatePath("/admin/branches");
}
