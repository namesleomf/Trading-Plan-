import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Section title with a short vertical blue accent bar on its left (ref 06). */
export function SectionTitle({
  children,
  right,
  as: Tag = "h2",
  className,
}: {
  children: ReactNode;
  right?: ReactNode;
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <Tag className="flex items-center gap-3 text-lg font-semibold tracking-tight">
        <span className="h-[18px] w-[3px] shrink-0 rounded-full bg-primary" aria-hidden />
        {children}
      </Tag>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}
