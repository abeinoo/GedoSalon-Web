import "server-only";

import { logger, errorMessage } from "@/lib/logger";

export const GENERIC_MUTATION_ERROR = "Something went wrong. Please try again.";

// Wraps a Server Action's database mutation so unexpected Prisma/DB errors
// are logged with context (never with raw stack traces or field values,
// just the event name and message) instead of only surfacing as a generic
// Next.js error boundary crash. Used by create/update actions, which return
// a form state the UI can render inline instead of redirecting to the
// nearest error.tsx.
export async function runMutation<T>(event: string, meta: Record<string, unknown>, fn: () => Promise<T>): Promise<{ ok: true; data: T } | { ok: false }> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    logger.error(event, { ...meta, error: errorMessage(error) });
    return { ok: false };
  }
}

// Same logging, but for delete/toggle actions that don't return a form
// state — logs then rethrows so the nearest error boundary still handles
// it, just with a server-side record of what failed.
export async function runVoidMutation<T>(event: string, meta: Record<string, unknown>, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logger.error(event, { ...meta, error: errorMessage(error) });
    throw error;
  }
}
