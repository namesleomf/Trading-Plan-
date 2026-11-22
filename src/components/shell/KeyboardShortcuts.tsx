"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { usePlanStore } from "@/store/usePlanStore";

/** 1–9 jump to sections, "[" collapses the sidebar. Ignored while typing in a field. */
export function KeyboardShortcuts() {
  const router = useRouter();
  const toggleSidebar = usePlanStore((s) => s.toggleSidebar);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))) return;
      // Don't fight with an open dialog/sheet.
      if (document.querySelector("[role=dialog]")) return;

      if (e.key === "[") {
        e.preventDefault();
        toggleSidebar();
        return;
      }
      const item = NAV_ITEMS.find((i) => i.key === e.key);
      if (item) {
        e.preventDefault();
        router.push(item.href);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, toggleSidebar]);

  return null;
}
