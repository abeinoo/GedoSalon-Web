"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageUploadField({
  name,
  folder,
  defaultValue,
  error,
}: {
  name: string;
  folder: "about" | "services" | "offers" | "hero" | "branches" | "barbers" | "gallery" | "seo";
  defaultValue?: string;
  error?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed.");
        return;
      }

      setValue(data.path);
    } catch {
      setUploadError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
          {value ? (
            <Image src={value} alt="Preview" fill sizes="96px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">No image</div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="inline-flex w-fit cursor-pointer items-center rounded-full border border-neutral-300 px-4 py-2 text-xs font-medium tracking-widest text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900">
            {uploading ? "UPLOADING…" : value ? "REPLACE IMAGE" : "UPLOAD IMAGE"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <p className="text-[11px] text-neutral-400">JPG, PNG or WEBP, up to 5MB.</p>
        </div>
      </div>

      <input type="hidden" name={name} value={value} />
      {(uploadError || error) && <p className="mt-1.5 text-xs text-red-500">{uploadError ?? error}</p>}
    </div>
  );
}
