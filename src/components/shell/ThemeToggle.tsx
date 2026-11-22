"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlanStore } from "@/store/usePlanStore";

/**
 * Switches between Midnight (dark) and Paper White (light).
 * The icon is drawn with CSS from <html data-theme>, so it is right on first paint.
 */
export function ThemeToggle({ showLabel, className }: { showLabel?: boolean; className?: string }) {
  const toggleTheme = usePlanStore((s) => s.toggleTheme);
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light / dark theme"
      className={cn(
        "flex items-center gap-3 rounded-full text-sm text-fg-2 transition-colors hover:bg-surface-raised/70 hover:text-fg",
        className,
      )}
    >
      <span className="grid size-5 shrink-0 place-items-center">
        <Sun className="hidden size-[18px] light:block" aria-hidden />
        <Moon className="size-[18px] light:hidden" aria-hidden />
      </span>
      {showLabel && (
        <span className="truncate sidebar-collapsed:lg:hidden">
          <span className="light:hidden">Midnight</span>
          <span className="hidden light:inline">Paper White</span>
        </span>
      )}
    </button>
  );
}
