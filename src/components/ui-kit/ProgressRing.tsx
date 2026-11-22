import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { limitTone, toneClasses, type Tone } from "@/lib/tone";

interface ProgressRingProps {
  /** 0 → 1 (values above 1 show a full ring). */
  value: number;
  size?: number;
  stroke?: number;
  /** Force a colour; otherwise green → amber at 70% → red at 100%. */
  tone?: Tone;
  label: string;
  children?: ReactNode;
  className?: string;
}

/** Circular progress, e.g. room left to the loss limit. */
export function ProgressRing({ value, size = 120, stroke = 10, tone, label, children, className }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const t = toneClasses[tone ?? limitTone(value)];
  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-surface-raised" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          className={cn("transition-[stroke-dashoffset] duration-700 ease-out", t.stroke)}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
