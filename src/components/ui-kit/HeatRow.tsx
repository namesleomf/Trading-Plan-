import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { limitTone, toneClasses, type Tone } from "@/lib/tone";

interface HeatRowProps {
  label: ReactNode;
  /** Display value, e.g. "$40 / $85". */
  value: ReactNode;
  /** How much of the limit is used: 0 = none, 1 = limit hit. */
  ratio: number;
  /** Force a colour; otherwise green → amber at 70% → red at 100%. */
  tone?: Tone;
  sublabel?: ReactNode;
  compact?: boolean;
  className?: string;
}

/** Row with a tinted bar behind it showing how close a value is to its limit (ref 05). */
export function HeatRow({ label, value, ratio, tone, sublabel, compact, className }: HeatRowProps) {
  const clamped = Math.max(0, Math.min(1, ratio));
  const t = toneClasses[tone ?? limitTone(ratio)];
  return (
    <div
      className={cn(
        "relative isolate flex items-center justify-between gap-4 overflow-hidden border border-line bg-surface-raised/40",
        compact ? "rounded-full px-3 py-1 text-xs" : "rounded-2xl px-4 py-3 text-sm",
        className,
      )}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
    >
      <span
        aria-hidden
        className={cn("absolute inset-y-0 left-0 -z-10 transition-[width] duration-500 ease-out", t.tint)}
        style={{ width: `${clamped * 100}%` }}
      />
      <span
        aria-hidden
        className={cn("absolute bottom-0 left-0 -z-10 h-0.5 transition-[width] duration-500 ease-out", t.bg)}
        style={{ width: `${clamped * 100}%` }}
      />
      <span className="min-w-0">
        <span className={cn("block truncate", compact ? "text-fg-2" : "text-fg")}>{label}</span>
        {sublabel && !compact && <span className="block truncate text-xs text-fg-3">{sublabel}</span>}
      </span>
      <span className={cn("num shrink-0 font-medium", t.text)}>{value}</span>
    </div>
  );
}
