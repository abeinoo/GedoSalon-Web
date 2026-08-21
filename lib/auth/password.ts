// No `server-only` guard here: this module is also imported by
// prisma/seed.ts, which runs outside Next.js's bundler under plain `tsx`
// (confirmed in Phase 2 — the guard throws there too, since it isn't Next's
// webpack/RSC build swapping in the no-op server build). That means nothing
// reachable from a Client Component may import this module — MIN_PASSWORD_LENGTH
// was split into ./constants.ts specifically so lib/validation/schemas.ts
// (imported directly by client form components) doesn't pull this file — and
// node:crypto — into the browser bundle. Confirmed this exact failure mode
// live in Phase 3.5 testing: it doesn't error at build time, it silently
// crashes the page at runtime instead.
import { randomBytes, scrypt, scryptSync, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

// A syntactically-valid hash (fixed salt, computed once at module load) for
// a password nobody will ever type. Used by the login action to run a real
// scrypt comparison even when the submitted email doesn't exist, so lookup
// failures and password mismatches take the same amount of time.
export const DUMMY_PASSWORD_HASH = `${"0".repeat(32)}:${scryptSync("dummy-password-for-timing", "0".repeat(32), KEY_LENGTH).toString("hex")}`;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;

  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

  if (keyBuffer.length !== derivedKey.length) return false;
  return timingSafeEqual(keyBuffer, derivedKey);
}
