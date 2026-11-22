"use client";

import { useSyncExternalStore } from "react";

/**
 * A shared ticking clock for the UI. Returns `null` during server rendering
 * and the very first browser render (so the HTML always matches), then the
 * current moment, updated every second. All components share one timer.
 */
let current: number | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (timer === undefined) {
    current = Date.now();
    timer = setInterval(() => {
      current = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

export function useNow(): Date | null {
  const ms = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
  return ms === null ? null : new Date(ms);
}
