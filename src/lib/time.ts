/**
 * New York time helpers — the ONLY place trading logic reads the clock.
 *
 * Every rule in the plan is written in New York time (ET), so we always
 * convert to America/New_York, whatever time zone this computer is set to.
 * date-fns-tz handles daylight saving (EST ↔ EDT) for us.
 *
 * Every function takes the moment to check as a `Date` argument (defaulting
 * to "now"), so tests can pass any fixed moment.
 */
import { formatInTimeZone } from "date-fns-tz";
import type { Session, TimeWindow, TradingWindows, Weekday } from "@/data/types";

export const ET = "America/New_York";

/** The current moment. Wrapped so there is a single place to read the clock. */
export function now(): Date {
  return new Date();
}

export interface ETParts {
  /** "2026-11-24", the New York calendar date. */
  dateKey: string;
  year: number;
  month: number; // 1–12
  day: number;
  hours: number; // 0–23
  minutes: number;
  seconds: number;
  /** 0 = Sunday … 6 = Saturday, in New York. */
  weekday: Weekday;
}

/** Break a moment into its New York date and clock parts. */
export function getETParts(date: Date = now()): ETParts {
  // "i" = ISO weekday (1 = Monday … 7 = Sunday)
  const [dateKey, hh, mm, ss, isoDay] = formatInTimeZone(date, ET, "yyyy-MM-dd|HH|mm|ss|i").split("|");
  const [year, month, day] = dateKey.split("-").map(Number);
  return {
    dateKey,
    year,
    month,
    day,
    hours: Number(hh),
    minutes: Number(mm),
    seconds: Number(ss),
    weekday: (Number(isoDay) % 7) as Weekday,
  };
}

/** Shorthand for "now in New York". */
export function nowET(): ETParts {
  return getETParts(now());
}

/** The New York calendar date, e.g. "2026-11-24". Used to reset things each trading day. */
export function etDateKey(date: Date = now()): string {
  return getETParts(date).dateKey;
}

/** Minutes since midnight in New York (0–1439). */
export function minutesSinceMidnightET(date: Date = now()): number {
  const p = getETParts(date);
  return p.hours * 60 + p.minutes;
}

/** "09:30" → 570. "24:00" → 1440 (end of day). */
export function parseClock(time: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) throw new Error(`Invalid time "${time}" (expected HH:mm)`);
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 24 || m > 59 || (h === 24 && m !== 0)) throw new Error(`Invalid time "${time}"`);
  return h * 60 + m;
}

/** 570 → "9:30 AM" (for display). */
export function formatClock(minutes: number): string {
  const total = ((minutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/**
 * Is a minute-of-day inside a window? Start is included, end is not
 * (9:30–11:00 includes 9:30 and 10:59, not 11:00). Windows that cross
 * midnight (e.g. 22:00–02:00) are handled.
 */
export function isMinuteInWindow(minute: number, window: TimeWindow): boolean {
  const start = parseClock(window.start);
  const end = parseClock(window.end);
  if (start === end) return false;
  if (start < end) return minute >= start && minute < end;
  return minute >= start || minute < end; // crosses midnight
}

/** Is this moment inside the window (in New York time)? */
export function isWithinWindow(date: Date, window: TimeWindow): boolean {
  return isMinuteInWindow(minutesSinceMidnightET(date), window);
}

/** Minutes from `minute` until the window ends (assumes we're inside it). */
export function minutesUntilWindowEnd(minute: number, window: TimeWindow): number {
  const end = parseClock(window.end);
  return end > minute ? end - minute : end + 1440 - minute;
}

/** Is today (in New York) one of my trading days? Default plan: Tuesday–Friday. */
export function isTradingDay(date: Date, tradingDays: readonly Weekday[]): boolean {
  return tradingDays.includes(getETParts(date).weekday);
}

export const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

/** 72 → "1h 12m", 23 → "23m", 0 → "0m". */
export function formatDuration(totalMinutes: number): string {
  const mins = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** The killzone/session we're in right now, if any. */
export function getActiveSession(date: Date, sessions: readonly Session[]): Session | null {
  const minute = minutesSinceMidnightET(date);
  return sessions.find((s) => s.window !== null && isMinuteInWindow(minute, s.window)) ?? null;
}

export type SessionStatusKind = "live" | "caution" | "pre" | "closed";

export interface SessionStatus {
  kind: SessionStatusKind;
  /** Short label for the top bar, e.g. "NY Killzone · 1h 12m left". */
  label: string;
  /** Minutes left in the window (live/caution) or until it opens (pre). */
  minutes: number | null;
}

/**
 * Where are we in the trading day?
 *  - not a trading day      → closed
 *  - before the window      → pre   ("Pre-market · opens in 23m")
 *  - inside the model time  → live  ("NY Killzone · 1h 12m left")
 *  - rest of the window     → caution ("Outside model time · 45m left")
 *  - after                  → closed
 */
export function getSessionStatus(
  date: Date,
  windows: TradingWindows,
  tradingDays: readonly Weekday[],
): SessionStatus {
  const p = getETParts(date);
  if (!tradingDays.includes(p.weekday)) {
    return { kind: "closed", label: `Closed · ${WEEKDAY_NAMES[p.weekday]}`, minutes: null };
  }

  const minute = p.hours * 60 + p.minutes;
  const start = parseClock(windows.allowed.start);

  if (isMinuteInWindow(minute, windows.allowed)) {
    const left = minutesUntilWindowEnd(minute, windows.allowed);
    return { kind: "live", label: `NY Killzone · ${formatDuration(left)} left`, minutes: left };
  }
  if (isMinuteInWindow(minute, windows.extended)) {
    const left = minutesUntilWindowEnd(minute, windows.extended);
    return { kind: "caution", label: `Outside model time · ${formatDuration(left)} left`, minutes: left };
  }
  if (minute < start) {
    const until = start - minute;
    return { kind: "pre", label: `Pre-market · opens in ${formatDuration(until)}`, minutes: until };
  }
  return { kind: "closed", label: "Closed", minutes: null };
}

/** "09:41:07" in New York. */
export function formatETClock(date: Date): string {
  return formatInTimeZone(date, ET, "HH:mm:ss");
}

/** "Tue, Nov 24" in New York. */
export function formatETDate(date: Date): string {
  return formatInTimeZone(date, ET, "EEE, MMM d");
}
