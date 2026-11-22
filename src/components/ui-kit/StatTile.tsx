import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn, type NumberFormat } from "@/lib/utils";
import { toneClasses, type Tone } from "@/lib/tone";
import { AnimatedNumber } from "./AnimatedNumber";
import { InfoTip } from "./InfoTip";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  /** Tooltip text for the ⓘ. */
  info?: string;
  /** Numbers count up when they change; strings/elements show as-is. */
  value: number | ReactNode;
  format?: NumberFormat;
  /** Colour of the icon square (and the value, if `valueTone` isn't set). */
  tone?: Tone;
  valueTone?: Tone | "default";
  delta?: { label: string; tone: Tone };
  hint?: ReactNode;
  className?: string;
}

/** Rounded tinted icon square + label + ⓘ + big mono value + optional delta (refs 07, 08). */
export function StatTile({
  icon: Icon,
  label,
  info,
  value,
  format = "int",
  tone = "blue",
  valueTone = "default",
  delta,
  hint,
  className,
}: StatTileProps) {
  const t = toneClasses[tone];
  return (
    <div className={cn("flex items-center gap-4 rounded-2xl border border-line bg-surface/80 p-4 shadow-card md:p-5", className)}>
      <div className={cn("grid size-11 shrink-0 place-items-center rounded-xl", t.tint, t.text)}>
        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-sm text-fg-2">
          <span className="leading-tight">{label}</span>
          {info && <InfoTip text={info} label={`About ${label}`} />}
        </div>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span
            className={cn(
              "num text-2xl font-semibold tracking-tight",
              valueTone === "default" ? "text-fg" : toneClasses[valueTone].text,
            )}
          >
            {typeof value === "number" ? <AnimatedNumber value={value} format={format} /> : value}
          </span>
          {delta && <span className={cn("num text-sm", toneClasses[delta.tone].text)}>{delta.label}</span>}
        </div>
        {hint && <div className="mt-1 text-xs text-fg-3">{hint}</div>}
      </div>
    </div>
  );
}
