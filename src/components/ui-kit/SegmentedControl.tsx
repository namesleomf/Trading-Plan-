"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[];
  /** `null` = nothing picked yet. */
  value: T | null;
  onChange: (value: T) => void;
  /** Accessible name for the group, e.g. "Daily bias". */
  label: string;
  size?: "sm" | "md";
  fullWidth?: boolean;
  className?: string;
}

/** Pill track with a sliding gold active pill (ref 07). Arrow keys move between options. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
  fullWidth,
  className,
}: SegmentedControlProps<T>) {
  const groupId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const step = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
    for (let i = 1; i <= options.length; i++) {
      const next = (index + step * i + options.length) % options.length;
      if (!options[next].disabled) {
        refs.current[next]?.focus();
        onChange(options[next].value);
        break;
      }
    }
  };

  const selectedIndex = options.findIndex((o) => o.value === value);

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line bg-surface-raised/60 p-1",
        fullWidth && "flex w-full",
        className,
      )}
    >
      {options.map((option, i) => {
        const active = option.value === value;
        // Only one option is in the Tab order: the selected one (or the first).
        const tabbable = selectedIndex === -1 ? i === 0 : active;
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={option.disabled}
            tabIndex={tabbable ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "relative rounded-full font-medium whitespace-nowrap transition-colors duration-200",
              size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm",
              fullWidth && "flex-1",
              active ? "text-gold" : "text-fg-2 hover:text-fg",
              option.disabled && "cursor-not-allowed opacity-40",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${groupId}`}
                className="absolute inset-0 rounded-full bg-gold/14 ring-1 ring-gold/30 ring-inset"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
                aria-hidden
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
