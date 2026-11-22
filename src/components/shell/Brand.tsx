import Link from "next/link";
import { Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

/** App mark + name. */
export function Brand({ hideTextWhenCollapsed, className }: { hideTextWhenCollapsed?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)} aria-label="Plan — go to Today">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-primary to-primary-2 text-white shadow-[0_8px_24px_-8px_var(--primary)]">
        <Crosshair className="size-[18px]" strokeWidth={2} aria-hidden />
      </span>
      <span className={cn("flex items-baseline gap-2", hideTextWhenCollapsed && "sidebar-collapsed:hidden")}>
        <span className="text-lg font-bold tracking-tight">Plan</span>
        <span className="num text-[11px] text-fg-3">v2026</span>
      </span>
    </Link>
  );
}
