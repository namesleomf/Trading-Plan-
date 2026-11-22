import { cn } from "@/lib/utils";
import { toneClasses, type Tone } from "@/lib/tone";

/** A small status dot that pulses gently (pulse is switched off under reduced motion). */
export function LiveDot({ tone = "green", pulse = true, className }: { tone?: Tone; pulse?: boolean; className?: string }) {
  const bg = toneClasses[tone].bg;
  return (
    <span className={cn("relative inline-flex size-2 shrink-0", className)} aria-hidden>
      {pulse && <span className={cn("absolute inset-0 animate-live-ping rounded-full motion-reduce:hidden", bg)} />}
      <span className={cn("relative inline-flex size-2 rounded-full", bg)} />
    </span>
  );
}
