/**
 * Colour "tones" used by pills, heat bars, rings and icon tiles.
 * Tailwind needs full class names written out, so they all live here.
 */
export type Tone = "blue" | "violet" | "green" | "amber" | "red" | "gold" | "muted";

export const toneClasses: Record<
  Tone,
  { text: string; bg: string; tint: string; softTint: string; ring: string; border: string; stroke: string }
> = {
  blue: {
    text: "text-primary",
    bg: "bg-primary",
    tint: "bg-primary/12",
    softTint: "bg-primary/8",
    ring: "ring-primary/25",
    border: "border-primary",
    stroke: "stroke-primary",
  },
  violet: {
    text: "text-primary-2",
    bg: "bg-primary-2",
    tint: "bg-primary-2/12",
    softTint: "bg-primary-2/8",
    ring: "ring-primary-2/25",
    border: "border-primary-2",
    stroke: "stroke-primary-2",
  },
  green: {
    text: "text-green",
    bg: "bg-green",
    tint: "bg-green/12",
    softTint: "bg-green/8",
    ring: "ring-green/25",
    border: "border-green",
    stroke: "stroke-green",
  },
  amber: {
    text: "text-amber",
    bg: "bg-amber",
    tint: "bg-amber/12",
    softTint: "bg-amber/8",
    ring: "ring-amber/25",
    border: "border-amber",
    stroke: "stroke-amber",
  },
  red: {
    text: "text-red",
    bg: "bg-red",
    tint: "bg-red/12",
    softTint: "bg-red/8",
    ring: "ring-red/25",
    border: "border-red",
    stroke: "stroke-red",
  },
  gold: {
    text: "text-gold",
    bg: "bg-gold",
    tint: "bg-gold/14",
    softTint: "bg-gold/8",
    ring: "ring-gold/30",
    border: "border-gold",
    stroke: "stroke-gold",
  },
  muted: {
    text: "text-fg-2",
    bg: "bg-fg-3",
    tint: "bg-fg-3/12",
    softTint: "bg-fg-3/8",
    ring: "ring-line-strong",
    border: "border-line-strong",
    stroke: "stroke-fg-3",
  },
};

/**
 * How close are we to a limit? 0 = nothing used, 1 = limit hit.
 * Below 70% is fine, 70% is "caution" (amber), 100% is "hit" (red).
 */
export function limitTone(ratio: number, safe: Tone = "green"): Tone {
  if (ratio >= 1) return "red";
  if (ratio >= 0.7) return "amber";
  return safe;
}
