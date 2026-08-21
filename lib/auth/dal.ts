import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import { prisma } from "@/lib/db";

// Authoritative auth check — call this at the top of every protected admin
// Server Component, Server Action, and Route Handler. Proxy (proxy.ts) only
// does an optimistic redirect for UX; this is the real security boundary.
//
// Beyond verifying the JWT signature, this re-checks the session against the
// database: the account must still exist, be active, and the token's
// sessionVersion must match the account's current sessionVersion. That's
// what lets a password change (or account deactivation) immediately
// invalidate every other already-issued session cookie, since a plain JWT
// signature check alone can't be revoked before its natural expiry.
//
// Note: this can't also clear the stale cookie here — Next.js only allows
// `cookies().delete()` inside a Server Action or Route Handler, and this
// runs during a Server Component render. That's fine: the cookie is left
// in the browser but permanently fails this same version check on every
// future request, so it's just as revoked. `logout()` (a Server Action)
// still clears it properly for the ordinary logout path.
export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/admin/login");
  }

  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });

  if (!user || !user.isActive || user.sessionVersion !== session.sessionVersion) {
    redirect("/admin/login");
  }

  return { isAuth: true, userId: user.id, email: user.email, sessionVersion: user.sessionVersion };
});

// Same check but returns null instead of redirecting — for Route Handlers
// (like the upload endpoint) that need to return a 401 JSON response.
export const getAuthenticatedUser = cache(async () => {
  const session = await getSession();
  if (!session?.userId) return null;

  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user || !user.isActive || user.sessionVersion !== session.sessionVersion) return null;

  return { userId: user.id, email: user.email };
});
