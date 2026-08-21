import "server-only";

// In-memory login throttle. Deliberately not backed by Redis/DB: this is a
// single-admin panel on a single VPS process, so a process-local Map is
// sufficient and adds no infrastructure. It resets on deploy/restart, which
// is an acceptable trade-off at this scale (documented in DEPLOY.md).
//
// Keyed by "ip:email" so a flood against one address doesn't lock out a
// different one, and so failed attempts against a *nonexistent* email are
// throttled identically to a real one — no signal about whether the email
// exists leaks through the rate-limit behavior itself.

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // failures older than this don't count
const LOCKOUT_MS = 15 * 60 * 1000; // how long a key is locked after MAX_ATTEMPTS

type Entry = {
  failures: number;
  firstFailureAt: number;
  lockedUntil?: number;
};

const globalForRateLimit = globalThis as unknown as { adminLoginAttempts?: Map<string, Entry> };
const attempts = globalForRateLimit.adminLoginAttempts ?? new Map<string, Entry>();
if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.adminLoginAttempts = attempts;
}

function pruneStale(entry: Entry, now: number): Entry | undefined {
  if (entry.lockedUntil && entry.lockedUntil > now) return entry;
  if (now - entry.firstFailureAt > WINDOW_MS) return undefined;
  return entry;
}

export function rateLimitKey(ip: string, email: string) {
  return `${ip}:${email.trim().toLowerCase()}`;
}

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const existing = attempts.get(key);
  if (!existing) return { allowed: true };

  const entry = pruneStale(existing, now);
  if (!entry) {
    attempts.delete(key);
    return { allowed: true };
  }

  if (entry.lockedUntil && entry.lockedUntil > now) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000) };
  }

  return { allowed: true };
}

export function recordFailedAttempt(key: string) {
  const now = Date.now();
  const existing = pruneStale(attempts.get(key) ?? { failures: 0, firstFailureAt: now }, now);
  const entry: Entry = existing ?? { failures: 0, firstFailureAt: now };

  entry.failures += 1;
  if (entry.failures >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }
  attempts.set(key, entry);
}

export function clearAttempts(key: string) {
  attempts.delete(key);
}
