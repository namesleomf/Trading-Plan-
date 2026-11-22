import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { toneClasses, type Tone } from "@/lib/tone";
import { LiveDot } from "./LiveDot";

interface FrameCardProps {
  /** Shown in the fake address bar. */
  title: ReactNode;
  /** Right-hand indicator text, e.g. "LIVE". Pass `false` to hide it. */
  live?: ReactNode | false;
  liveTone?: Tone;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** A card framed like a browser window: three dots + title bar + "● LIVE" (ref 04). */
export function FrameCard({ title, live = "LIVE", liveTone = "green", children, className, bodyClassName }: FrameCardProps) {
  return (
    <div className={cn("rounded-[30px] border border-line-strong bg-surface-raised/30 p-1.5 shadow-card", className)}>
      <div className="overflow-hidden rounded-3xl border border-line bg-surface">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-fg-3/35" />
            <span className="size-2.5 rounded-full bg-fg-3/35" />
            <span className="size-2.5 rounded-full bg-fg-3/35" />
          </div>
          <div className="num min-w-0 flex-1 truncate rounded-full border border-line bg-surface-raised/70 px-4 py-1 text-center text-xs text-fg-2">
            {title}
          </div>
          {live !== false && (
            <span className={cn("num flex items-center gap-2 text-xs font-semibold tracking-wider", toneClasses[liveTone].text)}>
              <LiveDot tone={liveTone} />
              {live}
            </span>
          )}
        </div>
        <div className={cn("p-5 md:p-7", bodyClassName)}>{children}</div>
      </div>
    </div>
  );
}
