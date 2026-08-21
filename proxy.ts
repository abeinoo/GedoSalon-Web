import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, decrypt } from "@/lib/auth/session";

// Optimistic auth check for /admin routes. This only reads the session
// cookie (no DB hit) to keep Proxy fast — the authoritative check happens
// in lib/auth/dal.ts's verifySession(), called by every protected page,
// Server Action, and the upload Route Handler.
//
// Deliberately one-directional: only bounces an unauthenticated visitor
// away from a protected route. It does NOT redirect an "authenticated"
// visitor away from /admin/login, because "authenticated" here only means
// "JWT signature is valid" — a session revoked by a password change still
// passes that check. Redirecting away from /admin/login on that basis
// would fight with verifySession() sending the same stale session back to
// /admin/login (it can't clear the cookie from a Server Component render),
// producing an infinite redirect loop. The login page itself does the
// real, DB-backed "already logged in" check instead.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";

  const session = await decrypt(request.cookies.get(SESSION_COOKIE)?.value);
  const isAuthenticated = Boolean(session?.userId);

  if (!isAuthenticated && !isLoginRoute) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
