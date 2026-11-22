"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TagPill } from "./TagPill";

interface ChecklistItemProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Shows a REQUIRED / OPTIONAL tag on the right. Omit to show no tag. */
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Pill-shaped row: circle check on the left, label, tag on the right. The tick springs in. */
export function ChecklistItem({
  label,
  description,
  checked,
  onCheckedChange,
  required,
  disabled,
  className,
}: ChecklistItemProps) {
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "group flex w-full items-center gap-3 border text-left transition-colors duration-200",
        description ? "rounded-2xl px-4 py-3" : "rounded-full px-3 py-2.5",
        checked
          ? "border-green/25 bg-green/8"
          : "border-line bg-surface-raised/40 hover:border-line-strong hover:bg-surface-raised/70",
        disabled && "cursor-not-allowed opacity-45",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-full border transition-colors duration-200",
          checked ? "border-green bg-green text-bg" : "border-line-strong group-hover:border-fg-3",
        )}
        aria-hidden
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
          <motion.path
            d="M3.5 8.5l3 3 6-7"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 26 }}
          />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm", checked ? "text-fg" : "text-fg")}>{label}</span>
        {description && <span className="mt-0.5 block text-xs text-fg-3">{description}</span>}
      </span>
      {required !== undefined && <TagPill variant={required ? "required" : "optional"} />}
    </button>
  );
}
