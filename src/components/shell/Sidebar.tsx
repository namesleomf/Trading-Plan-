"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isActive, type NavItem } from "@/lib/nav";
import { usePlanStore } from "@/store/usePlanStore";
import { Brand } from "./Brand";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Desktop sidebar (lg and up). Collapses to icons only with the button or "[".
 * Width and label visibility come from CSS (<html data-sidebar>), so there's no
 * jump on page load.
 */
export function Sidebar() {
  const pathname = usePathname();
  const toggleSidebar = usePlanStore((s) => s.toggleSidebar);
  const sections = NAV_ITEMS.filter((i) => i.href !== "/settings");
  const settings = NAV_ITEMS.find((i) => i.href === "/settings");

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-bg/60 px-3 py-5 transition-[width] duration-200 ease-out lg:flex",
        "sidebar-collapsed:w-[76px]",
      )}
      aria-label="Sections"
    >
      <div className="flex items-center justify-between px-2 sidebar-collapsed:justify-center">
        <Brand hideTextWhenCollapsed />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {sections.map((item) => (
          <SidebarLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-line pt-4">
        <ThemeToggle showLabel className="px-3 py-2.5 sidebar-collapsed:justify-center sidebar-collapsed:px-0" />
        {settings && <SidebarLink item={settings} active={isActive(pathname, settings.href)} />}
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex items-center gap-3 rounded-full px-3 py-2.5 text-sm text-fg-3 transition-colors hover:bg-surface-raised/70 hover:text-fg sidebar-collapsed:justify-center sidebar-collapsed:px-0"
          aria-label="Collapse or expand sidebar"
          title="Collapse sidebar  ["
        >
          <PanelLeft className="size-[18px] shrink-0" aria-hidden />
          <span className="flex-1 truncate text-left sidebar-collapsed:hidden">Collapse</span>
          <kbd className="num text-[11px] text-fg-3 sidebar-collapsed:hidden">[</kbd>
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={`${item.label}  (${item.key})`}
      className={cn(
        "group flex items-center gap-3 rounded-full px-3 py-2.5 text-sm transition-colors duration-150",
        "sidebar-collapsed:justify-center sidebar-collapsed:px-0",
        active
          ? "bg-primary/12 font-medium text-fg ring-1 ring-primary/25 ring-inset"
          : "text-fg-2 hover:bg-surface-raised/70 hover:text-fg",
      )}
    >
      <Icon
        className={cn("size-[18px] shrink-0", active ? "text-primary" : "text-fg-3 group-hover:text-fg-2")}
        strokeWidth={1.9}
        aria-hidden
      />
      <span className="flex-1 truncate sidebar-collapsed:hidden">{item.label}</span>
      <kbd className="num text-[11px] text-fg-3 opacity-0 transition-opacity group-hover:opacity-100 sidebar-collapsed:hidden">
        {item.key}
      </kbd>
    </Link>
  );
}
