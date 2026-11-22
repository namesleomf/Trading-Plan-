"use client";

/**
 * The app's memory. Holds the plan (seeded from src/data/plan.ts) and app
 * settings, and saves them in this browser's localStorage so a refresh or
 * closing the tab never loses anything.
 *
 * Day-by-day data (trades, lockouts, checklists) is added in later phases.
 */
import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { defaultPlan } from "@/data/plan";
import type { Plan } from "@/data/types";
import { STORAGE_KEY } from "./storageKey";

export type Theme = "dark" | "light";

export interface Settings {
  theme: Theme;
  sidebarCollapsed: boolean;
  activeAccountId: string;
}

interface PlanState {
  plan: Plan;
  settings: Settings;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setActiveAccount: (accountId: string) => void;
  /** Restore the original plan from plan.ts (settings are kept). */
  resetPlan: () => void;
}

export { STORAGE_KEY };

const defaultSettings: Settings = {
  theme: "dark",
  sidebarCollapsed: false,
  activeAccountId: "futures-50k",
};

/** Deep copy so the store never mutates the default plan object. */
const freshPlan = (): Plan => structuredClone(defaultPlan);

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      plan: freshPlan(),
      settings: defaultSettings,
      setTheme: (theme) => set((s) => ({ settings: { ...s.settings, theme } })),
      toggleTheme: () =>
        set((s) => ({ settings: { ...s.settings, theme: s.settings.theme === "dark" ? "light" : "dark" } })),
      toggleSidebar: () =>
        set((s) => ({ settings: { ...s.settings, sidebarCollapsed: !s.settings.sidebarCollapsed } })),
      setActiveAccount: (activeAccountId) => set((s) => ({ settings: { ...s.settings, activeAccountId } })),
      resetPlan: () => set({ plan: freshPlan() }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ plan: s.plan, settings: s.settings }),
      // Load saved data after the first render (see <Providers>), so the
      // server HTML and the browser's first render match.
      skipHydration: true,
      merge: (persisted, current) => {
        const saved = persisted as Partial<Pick<PlanState, "plan" | "settings">> | undefined;
        return {
          ...current,
          plan: saved?.plan ?? current.plan,
          settings: { ...current.settings, ...saved?.settings },
        };
      },
    },
  ),
);

/** True once saved data has been loaded from localStorage. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => usePlanStore.persist.onFinishHydration(onChange),
    () => usePlanStore.persist.hasHydrated(),
    () => false,
  );
}
