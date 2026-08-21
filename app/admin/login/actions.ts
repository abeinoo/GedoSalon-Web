"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyPassword, DUMMY_PASSWORD_HASH } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { checkRateLimit, rateLimitKey, recordFailedAttempt, clearAttempts } from "@/lib/auth/rate-limit";
import { LoginSchema, type LoginFormState } from "@/lib/validation/schemas";
import { logger } from "@/lib/logger";

const GENERIC_ERROR = "Invalid email or password.";
const RATE_LIMITED_ERROR = "Too many attempts. Please try again in a few minutes.";

async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  // Trust x-forwarded-for only insofar as the deployment sits behind a
  // reverse proxy that sets it (documented in DEPLOY.md); falls back to a
  // constant bucket if absent so rate limiting still applies (coarser, but
  // never disabled) rather than throwing.
  const forwardedFor = headerStore.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headerStore.get("x-real-ip") ?? "unknown";
}

export async function login(_state: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;
  const ip = await getClientIp();
  const key = rateLimitKey(ip, email);

  const rateLimit = checkRateLimit(key);
  if (!rateLimit.allowed) {
    logger.warn("admin.login.rate_limited", { ip, email });
    return { message: RATE_LIMITED_ERROR };
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });

  // Always run a password comparison, even for a nonexistent user, against
  // a fixed dummy hash — keeps response time consistent so a timing
  // difference can't be used to enumerate which emails have accounts.
  const passwordMatches = await verifyPassword(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);

  if (!user || !user.isActive || !passwordMatches) {
    recordFailedAttempt(key);
    logger.warn("admin.login.failed", { ip, email });
    return { message: GENERIC_ERROR };
  }

  clearAttempts(key);
  await createSession(user.id, user.email, user.sessionVersion);
  logger.info("admin.login.success", { ip, userId: user.id, email: user.email });
  redirect("/admin");
}
