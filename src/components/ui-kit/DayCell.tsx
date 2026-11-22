import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DayOutcome = "followed" | "broke" | "none";

interface DayCellProps {
  day: number;
  outcome?: DayOutcome;
  today?: boolean;
  /** Days outside the current month / non-trading days. */
  muted?: boolean;
  /** Small text under the number, e.g. "1/3". */
  label?: ReactNode;
  className?: string;
}

const outcomeClasses: Record<DayOutcome, string> = {
  followed: "border-green/45 bg-green/10 text-green",
  broke: "border-red/45 bg-red/10 text-red",
  none: "border-line bg-surface-raised/40 text-fg",
};

/** Rounded calendar cell: green = followed plan, red = broke a rule, gold outline = today (refs 08, 09). */
export function DayCell({ day, outcome = "none", today, muted, label, className }: DayCellProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-square min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl border text-sm",
        outcomeClasses[outcome],
        muted && outcome === "none" && "text-fg-3 opacity-60",
        today && "ring-2 ring-gold ring-offset-2 ring-offset-surface",
        className,
      )}
      aria-current={today ? "date" : undefined}
    >
      {today && <span className="absolute top-1.5 left-1.5 size-1.5 rounded-full bg-gold" aria-hidden />}
      <span className="num font-semibold">{day}</span>
      {label && <span className="num text-[10px] leading-none opacity-80">{label}</span>}
    </div>
  );
}
