"use client";

import { useState, type ReactNode } from "react";

export default function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-5">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-neutral-900">{title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{description}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-neutral-300 px-5 py-2 text-xs font-medium tracking-widest text-neutral-700 transition hover:border-neutral-900"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onConfirm();
                }}
                className="rounded-full bg-red-600 px-5 py-2 text-xs font-medium tracking-widest text-white transition hover:bg-red-700"
              >
                {confirmLabel.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
