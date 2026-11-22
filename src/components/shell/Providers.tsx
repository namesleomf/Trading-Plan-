"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useHydrated, usePlanStore } from "@/store/usePlanStore";

/** Loads saved data, keeps <html> attributes in sync, and sets up shared UI context. */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Load saved plan + settings from localStorage (skipped during server render).
    void usePlanStore.persist.rehydrate();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <DocumentSync />
        {children}
      </TooltipProvider>
    </MotionConfig>
  );
}

/** Mirrors theme + sidebar state onto <html data-theme data-sidebar> (CSS reads these). */
function DocumentSync() {
  const hydrated = useHydrated();
  const theme = usePlanStore((s) => s.settings.theme);
  const collapsed = usePlanStore((s) => s.settings.sidebarCollapsed);

  useEffect(() => {
    // Wait until saved settings are loaded, or we'd briefly overwrite them with defaults.
    if (!hydrated) return;
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.sidebar = collapsed ? "collapsed" : "expanded";
  }, [hydrated, theme, collapsed]);

  return null;
}
