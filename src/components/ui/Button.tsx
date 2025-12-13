// src/components/ui/Button.tsx

"use client";

import { cn } from "@/lib/cn";

export default function Button({
  children,
  className,
  variant = "solid",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
}) {
  const base =
    "rounded-xl px-4 py-2 text-sm font-medium transition border disabled:opacity-60 disabled:cursor-not-allowed";

  const solid =
    "border-[color:var(--border)] bg-[color:var(--primary)] text-[color:var(--primary-contrast)] hover:bg-[color:var(--primary-hover)]";

  const ghost =
    "border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--text)] hover:bg-[color:var(--surface-3)]";

  return (
    <button className={cn(base, variant === "solid" ? solid : ghost, className)} {...props}>
      {children}
    </button>
  );
}
