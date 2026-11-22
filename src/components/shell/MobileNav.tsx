"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isActive, type NavItem } from "@/lib/nav";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

const BAR = ["/", "/pre-session", "/checklist", "/risk"];

/** Floating glass bottom bar for phones/tablets (ref 09). Checklist is the highlighted centre button. */
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const bar = BAR.map((href) => NAV_ITEMS.find((i) => i.href === href)).filter((i): i is NavItem => !!i);
  const more = NAV_ITEMS.filter((i) => !BAR.includes(i.href));
  const moreActive = more.some((i) => isActive(pathname, i.href));

  return (
    <nav
      aria-label="Sections"
      className="glass fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 mx-auto grid h-[68px] max-w-lg grid-cols-5 items-center rounded-[28px] border border-line-strong px-1 shadow-card lg:hidden"
    >
      {bar.slice(0, 2).map((item) => (
        <BarLink key={item.href} item={item} active={isActive(pathname, item.href)} />
      ))}
      <BarLink item={bar[2]} active={isActive(pathname, bar[2].href)} highlight />
      <BarLink item={bar[3]} active={isActive(pathname, bar[3].href)} />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] transition-colors",
              moreActive ? "text-primary" : "text-fg-3 hover:text-fg-2",
            )}
          >
            <Ellipsis className="size-[22px]" strokeWidth={1.8} aria-hidden />
            More
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="mx-auto max-w-lg">
          <div>
            <SheetTitle>More sections</SheetTitle>
            <SheetDescription>Everything else in your plan.</SheetDescription>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {more.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm transition-colors",
                    active
                      ? "border-primary/30 bg-primary/12 text-fg"
                      : "border-line bg-surface-raised/40 text-fg-2 hover:text-fg",
                  )}
                >
                  <Icon className={cn("size-[18px]", active ? "text-primary" : "text-fg-3")} aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <ThemeToggle showLabel className="border border-line px-4 py-3" />
        </SheetContent>
      </Sheet>
    </nav>
  );
}

function BarLink({ item, active, highlight }: { item: NavItem; active: boolean; highlight?: boolean }) {
  const Icon = item.icon;
  if (highlight) {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className="flex flex-col items-center gap-1 text-[11px] font-medium text-green"
      >
        <span
          className={cn(
            "grid size-10 place-items-center rounded-2xl bg-green/14 ring-1 ring-green/35 ring-inset transition-shadow",
            active && "shadow-[0_0_20px_-4px_var(--green)]",
          )}
        >
          <Icon className="size-5" strokeWidth={2} aria-hidden />
        </span>
        {item.short}
      </Link>
    );
  }
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] transition-colors",
        active ? "text-primary" : "text-fg-3 hover:text-fg-2",
      )}
    >
      <Icon className="size-[22px]" strokeWidth={1.8} aria-hidden />
      {item.short}
    </Link>
  );
}
