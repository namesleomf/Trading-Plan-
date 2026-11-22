import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Join class names, letting later Tailwind classes win over earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usd2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** 1234 → "$1,234". Pass cents=true for "$1,234.00". */
export function formatUSD(value: number, cents = false): string {
  return (cents ? usd2 : usd0).format(value);
}

/** 1234 → "+$1,234", -20 → "−$20". */
export function formatSignedUSD(value: number): string {
  if (value === 0) return "$0";
  return `${value > 0 ? "+" : "−"}${usd0.format(Math.abs(value))}`;
}

/** 50000 → "50K", 100000 → "100K". */
export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1000) return `${+(value / 1000).toFixed(1)}K`;
  return String(value);
}

export type NumberFormat = "int" | "usd" | "signed-usd" | "pct" | "compact";

export function formatNumber(value: number, format: NumberFormat): string {
  switch (format) {
    case "usd":
      return formatUSD(Math.round(value));
    case "signed-usd":
      return formatSignedUSD(Math.round(value));
    case "pct":
      return `${Math.round(value)}%`;
    case "compact":
      return formatCompact(value);
    default:
      return String(Math.round(value));
  }
}
