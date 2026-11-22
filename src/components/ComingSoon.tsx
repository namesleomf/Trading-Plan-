import type { LucideIcon } from "lucide-react";
import { EmptyState, StatusPill } from "@/components/ui-kit";

/** Placeholder for a section that gets built in a later phase. */
export function ComingSoon({
  icon,
  phase,
  title,
  features,
}: {
  icon: LucideIcon;
  phase: number;
  title: string;
  features: string[];
}) {
  return (
    <EmptyState icon={icon} title={title} badge={<StatusPill tone="blue">Coming in Phase {phase}</StatusPill>}>
      <ul className="mt-2 space-y-1.5 text-left">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </EmptyState>
  );
}
