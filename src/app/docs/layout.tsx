import type { ReactNode } from "react";

export default function DocsRouteLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-[calc(100dvh-7rem)]">{children}</div>;
}
