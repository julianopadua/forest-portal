// src/components/ui/Button.tsx

"use client";

import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "ghost";
type ButtonSize = "sm" | "md";

export default function Button({
  children,
  className,
  variant = "solid",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  const base =
    "rounded-xl text-sm font-medium transition border disabled:opacity-60 disabled:cursor-not-allowed";

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };

  const solid =
    "border-[color:var(--border)] bg-[color:var(--primary)] text-[color:var(--primary-contrast)] hover:bg-[color:var(--primary-hover)]";

  const ghost =
    "border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-3)]";

  return (
    <button
      className={cn(base, sizes[size], variant === "solid" ? solid : ghost, className)}
      {...props}
    >
      {children}
    </button>
  );
}
