"use server";

import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { deleteSession } from "@/lib/auth/session";
import { ChangePasswordSchema, type ChangePasswordFormState } from "@/lib/validation/schemas";
import { logger, errorMessage } from "@/lib/logger";

export async function changePassword(
  _state: ChangePasswordFormState,
  formData: FormData
): Promise<ChangePasswordFormState> {
  const session = await verifySession();

  const validatedFields = ChangePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user) {
    return { message: "Your session is no longer valid. Please log in again." };
  }

  const currentPasswordMatches = await verifyPassword(validatedFields.data.currentPassword, user.passwordHash);
  if (!currentPasswordMatches) {
    logger.warn("admin.password_change.failed", { userId: user.id, reason: "wrong_current_password" });
    return { errors: { currentPassword: ["Current password is incorrect."] } };
  }

  const newPasswordHash = await hashPassword(validatedFields.data.newPassword);

  try {
    // Bumping sessionVersion invalidates every previously issued session —
    // verifySession() compares this against what each session's JWT was
    // issued with, so every device (including this one) now fails that check.
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash, sessionVersion: { increment: 1 } },
    });
  } catch (error) {
    logger.error("admin.password_change.failed", { userId: user.id, reason: "db_error", error: errorMessage(error) });
    return { message: "Something went wrong. Please try again." };
  }

  logger.info("admin.password_change.success", { userId: user.id });

  // Deliberately log the admin all the way out (rather than re-issuing a
  // session for this browser): clears the cookie here, in a Server Action,
  // where cookie mutation is actually allowed (unlike verifySession(),
  // which runs during a Server Component render and can only redirect, not
  // clear cookies — see proxy.ts for why that distinction matters). Because
  // this properly clears the cookie instead of leaving a stale one behind,
  // there's no stale-cookie bounce-back and no proxy/login redirect loop.
  await deleteSession();
  redirect("/admin/login?passwordChanged=1");
}
