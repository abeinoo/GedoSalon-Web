import "server-only";

import { unlink } from "node:fs/promises";
import path from "node:path";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

// Deletes a previously uploaded image given its public path (e.g.
// "/uploads/services/abc123.jpg"). Silently no-ops for anything that isn't
// one of our own uploads (seeded placeholder paths like
// "/images/placeholders/*.svg" must never be touched), and never throws —
// a missing/already-deleted file shouldn't fail the calling mutation.
export async function deleteUploadedFile(publicPath: string | null | undefined) {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return;

  const resolved = path.resolve(path.join(process.cwd(), "public", publicPath));
  if (!resolved.startsWith(UPLOADS_ROOT + path.sep)) return;

  try {
    await unlink(resolved);
  } catch {
    // Already gone, or never existed — fine.
  }
}
