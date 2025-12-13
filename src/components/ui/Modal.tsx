// src/components/ui/Modal.tsx

"use client";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 backdrop-blur-xl"
        style={{ boxShadow: "var(--shadow-float)" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold">{title}</div>
          <button
            onClick={onClose}
            className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 py-1 hover:bg-[color:var(--surface-3)]"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
