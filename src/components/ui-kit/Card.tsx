import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** The base card: rounded-3xl, 1px faint border, very soft shadow. */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-3xl border border-line bg-surface/80 p-5 shadow-card md:p-6", className)}
      {...props}
    />
  );
}

/** An inner tile inside a card (rounded-2xl, raised surface). */
export function Tile({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-2xl border border-line bg-surface-raised/50 p-4", className)} {...props} />;
}
