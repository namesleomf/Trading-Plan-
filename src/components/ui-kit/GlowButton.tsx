import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const base =
  "group relative inline-flex items-center justify-center gap-3 rounded-full font-semibold whitespace-nowrap transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-40";

const variantClasses: Record<Variant, string> = {
  // Blue→violet gradient pill with an arrow tile (refs 03, 05)
  primary:
    "bg-linear-to-r from-primary to-primary-2 text-white shadow-[0_10px_30px_-12px_var(--primary)] hover:brightness-110 hover:shadow-[0_14px_36px_-12px_var(--primary)]",
  // Dark pill with a glowing bottom edge (ref 01)
  secondary:
    "border border-line-strong bg-linear-to-b from-surface-raised to-bg text-fg shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_6%,transparent),0_12px_32px_-14px_var(--primary)] hover:border-primary/40",
  // Outlined pill (ref 02)
  ghost: "border border-line-strong bg-transparent text-fg hover:border-fg-3 hover:bg-surface-raised/50",
  danger: "bg-red/14 text-red ring-1 ring-red/30 ring-inset hover:bg-red/20",
};

const sizeClasses = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
} as const;

interface CommonProps {
  variant?: Variant;
  size?: keyof typeof sizeClasses;
  /** Show the arrow (in a tile on primary buttons). */
  arrow?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps & Omit<ComponentProps<"button">, keyof CommonProps> & { href?: undefined };
type LinkProps = CommonProps & { href: string; onClick?: () => void };

function Inner({ variant, size, arrow, children }: Pick<CommonProps, "variant" | "size" | "arrow" | "children">) {
  return (
    <>
      <span className="relative">{children}</span>
      {arrow &&
        (variant === "primary" ? (
          <span
            className={cn(
              "relative -mr-3 grid place-items-center rounded-full bg-white/18 transition-transform group-hover:translate-x-0.5",
              size === "lg" ? "size-9" : size === "sm" ? "size-6" : "size-8",
            )}
          >
            <ArrowRight className="size-4" aria-hidden />
          </span>
        ) : (
          <ArrowRight className="relative size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        ))}
      {variant === "secondary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[18%] -bottom-px h-px bg-linear-to-r from-transparent via-[#93b4ff] to-transparent shadow-[0_0_12px_2px_var(--primary)]"
        />
      )}
    </>
  );
}

/** Pill button. primary = gradient + arrow tile, secondary = dark with glowing edge, ghost = outlined. */
export function GlowButton(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", arrow, children, className } = props;
  const classes = cn(base, variantClasses[variant], sizeClasses[size], className);
  const inner = (
    <Inner variant={variant} size={size} arrow={arrow}>
      {children}
    </Inner>
  );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} onClick={props.onClick} className={classes}>
        {inner}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, arrow: _a, children: _c, className: _cl, href: _h, ...rest } = props;
  return (
    <button type="button" className={classes} {...rest}>
      {inner}
    </button>
  );
}
