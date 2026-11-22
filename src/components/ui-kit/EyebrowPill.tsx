import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/tone";
import { LiveDot } from "./LiveDot";

interface EyebrowPillProps {
  /** Letter-spaced label, e.g. "LATEST" or "LIVE · NY AM". */
  label: ReactNode;
  /** Text after the divider, e.g. "Plan v2026". */
  meta?: ReactNode;
  dot?: Tone;
  pulse?: boolean;
  arrow?: boolean;
  href?: string;
  className?: string;
}

/** Outlined eyebrow pill: "● LIVE · NY AM" or "LATEST | Plan v2026 →" (refs 01, 05). */
export function EyebrowPill({ label, meta, dot, pulse = true, arrow, href, className }: EyebrowPillProps) {
  const content = (
    <>
      {dot && <LiveDot tone={dot} pulse={pulse} />}
      <span className="eyebrow text-primary">{label}</span>
      {meta && (
        <>
          <span className="h-3.5 w-px bg-line-strong" aria-hidden />
          <span className="num text-xs text-fg-2">{meta}</span>
        </>
      )}
      {arrow && <ArrowRight className="size-3.5 text-fg-3 transition-transform group-hover:translate-x-0.5" aria-hidden />}
    </>
  );
  const classes = cn(
    "group inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface/50 px-3.5 py-1.5",
    href && "transition-colors hover:border-primary/40",
    className,
  );
  return href ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <span className={classes}>{content}</span>
  );
}

/** "— PRE-SESSION": eyebrow label with a short leading line (ref 03). */
export function EyebrowLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-3 text-primary", className)}>
      <span className="h-px w-6 bg-current" aria-hidden />
      {children}
    </span>
  );
}

/** "◆ THE PLATFORM ◆": centred badge with diamond-ended lines (ref 04). */
export function DiamondBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <span className="h-px w-10 bg-linear-to-r from-transparent to-primary/60 sm:w-16" aria-hidden />
      <span className="size-1.5 rotate-45 bg-primary" aria-hidden />
      <span className="eyebrow mx-2 rounded-lg border border-line bg-surface-raised px-3 py-2 text-primary">{children}</span>
      <span className="size-1.5 rotate-45 bg-primary" aria-hidden />
      <span className="h-px w-10 bg-linear-to-l from-transparent to-primary/60 sm:w-16" aria-hidden />
    </div>
  );
}
