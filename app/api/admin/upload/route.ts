import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getAuthenticatedUser } from "@/lib/auth/dal";
import { logger, errorMessage } from "@/lib/logger";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const ALLOWED_FOLDERS = new Set(["about", "services", "offers", "hero", "branches", "barbers", "gallery", "seo"]);

// The browser-reported `file.type` is just a client-supplied label — verify
// the actual bytes match one of our allowed formats instead of trusting it.
// Each check only needs the first few bytes, so this is cheap even for a
// 5MB file.
function detectImageType(buffer: Buffer): "image/jpeg" | "image/png" | "image/webp" | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (typeof folder !== "string" || !ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Invalid upload folder." }, { status: 400 });
  }
  if (!ALLOWED_TYPES[file.type]) {
    return NextResponse.json({ error: "Only JPG, PNG, and WEBP images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const actualType = detectImageType(buffer);
  if (!actualType) {
    logger.warn("admin.upload.rejected_content", { userId: user.userId, folder, claimedType: file.type });
    return NextResponse.json({ error: "This file doesn't look like a valid JPG, PNG, or WEBP image." }, { status: 400 });
  }

  // Belt-and-suspenders: the extension on disk matches what the bytes
  // actually are, not what the browser claimed in `file.type`.
  const extension = ALLOWED_TYPES[actualType];
  const filename = `${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  try {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
  } catch (error) {
    logger.error("admin.upload.write_failed", { userId: user.userId, folder, error: errorMessage(error) });
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }

  logger.info("admin.upload.success", { userId: user.userId, folder, filename });

  return NextResponse.json({ path: `/uploads/${folder}/${filename}` });
}
