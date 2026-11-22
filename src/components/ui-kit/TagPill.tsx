import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  long: "bg-primary/14 text-primary",
  short: "bg-red/14 text-red",
  required: "text-red ring-1 ring-inset ring-red/50",
  optional: "bg-fg-3/12 text-fg-3",
  reversal: "bg-primary-2/14 text-primary-2",
  continuation: "bg-green/12 text-green",
  hard: "bg-red/12 text-red",
  principle: "bg-fg-3/12 text-fg-2",
  neutral: "bg-surface-raised text-fg-2 ring-1 ring-inset ring-line",
} as const;

export type TagVariant = keyof typeof variants;

const defaultLabels: Record<TagVariant, string> = {
  long: "Long",
  short: "Short",
  required: "Required",
  optional: "Optional",
  reversal: "Reversal",
  continuation: "Continuation",
  hard: "Hard rule",
  principle: "Principle",
  neutral: "Neutral",
};

/** Small uppercase tag: LONG, SHORT, REQUIRED, OPTIONAL, REVERSAL, CONTINUATION… */
export function TagPill({ variant, children, className }: { variant: TagVariant; children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "num inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold tracking-[0.12em] whitespace-nowrap uppercase",
        variants[variant],
        className,
      )}
    >
      {children ?? defaultLabels[variant]}
    </span>
  );
}
