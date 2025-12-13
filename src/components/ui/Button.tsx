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
  return (
    <button
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-medium transition border",
        variant === "solid" &&
          "border-white/10 bg-white text-zinc-950 hover:bg-zinc-200",
        variant === "ghost" &&
          "border-white/10 bg-white/5 text-white hover:bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
