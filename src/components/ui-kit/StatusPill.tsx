import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { toneClasses, type Tone } from "@/lib/tone";
import { LiveDot } from "./LiveDot";

const sizes = {
  sm: "gap-1.5 px-2.5 py-1 text-xs",
  md: "gap-2 px-3 py-1.5 text-sm",
  lg: "gap-2.5 px-4 py-2 text-sm font-semibold tracking-wide uppercase",
} as const;

/** Dot + text on a tinted background: "● Clear to trade", "● Caution", "● Locked". */
export function StatusPill({
  tone,
  children,
  pulse = false,
  size = "sm",
  className,
}: {
  tone: Tone;
  children: ReactNode;
  pulse?: boolean;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const t = toneClasses[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium whitespace-nowrap ring-1 ring-inset",
        t.tint,
        t.text,
        t.ring,
        sizes[size],
        className,
      )}
    >
      <LiveDot tone={tone} pulse={pulse} />
      {children}
    </span>
  );
}
