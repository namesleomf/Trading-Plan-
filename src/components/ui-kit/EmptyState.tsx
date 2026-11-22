import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Calm placeholder card for sections that are still empty or coming in a later phase. */
export function EmptyState({
  icon: Icon,
  title,
  children,
  badge,
  className,
}: {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
  badge?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-3xl border border-dashed border-line-strong bg-surface/40 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary">
        <Icon className="size-6" strokeWidth={1.75} aria-hidden />
      </div>
      {badge && <div className="mt-5">{badge}</div>}
      <h2 className="mt-4 text-lg font-semibold tracking-tight">{title}</h2>
      {children && <div className="mt-2 max-w-md text-sm text-fg-2">{children}</div>}
    </div>
  );
}
