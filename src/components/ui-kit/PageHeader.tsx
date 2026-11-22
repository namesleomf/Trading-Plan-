import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** Usually an <EyebrowPill> or <EyebrowLabel>. */
  eyebrow?: ReactNode;
  /** First part of the title, in white. */
  title: string;
  /** Key words shown in the blue→violet gradient. */
  highlight?: string;
  /** Put the highlight on its own line (default) or straight after the title. */
  inline?: boolean;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/** Big page title sitting in the spotlight glow, e.g. "Today. **Clear to trade.**" */
export function PageHeader({ eyebrow, title, highlight, inline, subtitle, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("relative pt-4 pb-8 md:pt-8 md:pb-10", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-0 -z-10 h-72 w-full max-w-3xl rounded-full bg-[radial-gradient(ellipse_at_center,var(--glow),transparent_70%)] blur-2xl"
      />
      {eyebrow && <div className="mb-5">{eyebrow}</div>}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h1 className="text-[2.25rem] leading-[1.05] font-bold tracking-[-0.03em] md:text-5xl">
            {title}
            {highlight && (
              <>
                {inline ? " " : <br />}
                <span className="text-gradient">{highlight}</span>
              </>
            )}
          </h1>
          {subtitle && <p className="mt-4 max-w-2xl text-base text-fg-2 md:text-lg">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
      </div>
    </header>
  );
}
