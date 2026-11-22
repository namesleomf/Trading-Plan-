import { describe, expect, it } from "vitest";
import { defaultPlan } from "@/data/plan";
import {
  etDateKey,
  formatClock,
  formatDuration,
  formatETClock,
  getActiveSession,
  getETParts,
  getSessionStatus,
  isMinuteInWindow,
  isTradingDay,
  isWithinWindow,
  minutesSinceMidnightET,
  parseClock,
} from "./time";

const { tradingDays, tradingWindows, sessions } = defaultPlan;
const status = (iso: string) => getSessionStatus(new Date(iso), tradingWindows, tradingDays);

describe("getETParts", () => {
  it("converts a UTC moment to New York time in winter (EST, UTC−5)", () => {
    const p = getETParts(new Date("2026-11-24T14:30:00Z"));
    expect(p).toMatchObject({ dateKey: "2026-11-24", hours: 9, minutes: 30, weekday: 2 });
  });

  it("converts a UTC moment to New York time in summer (EDT, UTC−4)", () => {
    const p = getETParts(new Date("2026-07-14T13:30:00Z"));
    expect(p).toMatchObject({ dateKey: "2026-07-14", hours: 9, minutes: 30, weekday: 2 });
  });

  it("uses the New York calendar day, not UTC's", () => {
    // 02:00 UTC on Wednesday is still Tuesday 9 PM in New York.
    const p = getETParts(new Date("2026-11-25T02:00:00Z"));
    expect(p.dateKey).toBe("2026-11-24");
    expect(p.weekday).toBe(2);
    expect(etDateKey(new Date("2026-11-25T02:00:00Z"))).toBe("2026-11-24");
  });

  it("gives the same answer however the moment was written (Tokyo, LA, UTC)", () => {
    const tokyo = new Date("2026-11-24T23:30:00+09:00");
    const la = new Date("2026-11-24T06:30:00-08:00");
    const utc = new Date("2026-11-24T14:30:00Z");
    for (const d of [tokyo, la, utc]) {
      expect(formatETClock(d)).toBe("09:30:00");
      expect(getETParts(d).weekday).toBe(2);
    }
  });
});

describe("daylight saving", () => {
  it("before spring-forward (Tue 3 Mar 2026), 9:30 ET is 14:30 UTC", () => {
    expect(minutesSinceMidnightET(new Date("2026-03-03T14:30:00Z"))).toBe(570);
    expect(status("2026-03-03T13:30:00Z").kind).toBe("pre"); // 8:30 ET
  });

  it("after spring-forward (Tue 10 Mar 2026), 9:30 ET is 13:30 UTC", () => {
    expect(minutesSinceMidnightET(new Date("2026-03-10T13:30:00Z"))).toBe(570);
    expect(status("2026-03-10T13:30:00Z").kind).toBe("live");
  });

  it("on spring-forward night, 2:00 AM jumps to 3:00 AM", () => {
    // 06:59 UTC = 1:59 EST; 07:00 UTC = 3:00 EDT
    expect(formatETClock(new Date("2026-03-08T06:59:00Z"))).toBe("01:59:00");
    expect(formatETClock(new Date("2026-03-08T07:00:00Z"))).toBe("03:00:00");
  });

  it("on fall-back night, 1:00 AM happens twice", () => {
    expect(formatETClock(new Date("2026-11-01T05:30:00Z"))).toBe("01:30:00"); // EDT
    expect(formatETClock(new Date("2026-11-01T06:30:00Z"))).toBe("01:30:00"); // EST
  });

  it("after fall-back (Tue 3 Nov 2026), 9:30 ET is 14:30 UTC again", () => {
    expect(status("2026-11-03T14:30:00Z").kind).toBe("live");
    expect(status("2026-11-03T13:30:00Z").kind).toBe("pre");
  });
});

describe("isTradingDay (Tuesday–Friday)", () => {
  it.each([
    ["2026-11-22T15:00:00Z", false], // Sunday
    ["2026-11-23T15:00:00Z", false], // Monday = NO
    ["2026-11-24T15:00:00Z", true], // Tuesday
    ["2026-11-25T15:00:00Z", true], // Wednesday
    ["2026-11-26T15:00:00Z", true], // Thursday
    ["2026-11-27T15:00:00Z", true], // Friday
    ["2026-11-28T15:00:00Z", false], // Saturday
  ])("%s → %s", (iso, expected) => {
    expect(isTradingDay(new Date(iso), tradingDays)).toBe(expected);
  });

  it("Monday 11 PM in New York is still Monday, even though it's Tuesday in UTC", () => {
    expect(isTradingDay(new Date("2026-11-24T04:00:00Z"), tradingDays)).toBe(false);
  });
});

describe("windows", () => {
  it("parses and formats clock times", () => {
    expect(parseClock("09:30")).toBe(570);
    expect(parseClock("24:00")).toBe(1440);
    expect(() => parseClock("9.30")).toThrow();
    expect(formatClock(570)).toBe("9:30 AM");
    expect(formatClock(810)).toBe("1:30 PM");
    expect(formatClock(0)).toBe("12:00 AM");
  });

  it("includes the start and excludes the end", () => {
    const w = { start: "09:30", end: "11:00" };
    expect(isMinuteInWindow(569, w)).toBe(false);
    expect(isMinuteInWindow(570, w)).toBe(true);
    expect(isMinuteInWindow(659, w)).toBe(true);
    expect(isMinuteInWindow(660, w)).toBe(false);
  });

  it("handles windows that cross midnight", () => {
    const w = { start: "22:00", end: "02:00" };
    expect(isMinuteInWindow(23 * 60, w)).toBe(true);
    expect(isMinuteInWindow(60, w)).toBe(true);
    expect(isMinuteInWindow(3 * 60, w)).toBe(false);
  });

  it("checks a moment against a window in New York time", () => {
    expect(isWithinWindow(new Date("2026-11-24T14:35:00Z"), tradingWindows.noEntryOpen)).toBe(true);
    expect(isWithinWindow(new Date("2026-11-24T14:40:00Z"), tradingWindows.noEntryOpen)).toBe(false);
  });

  it("finds the active killzone", () => {
    expect(getActiveSession(new Date("2026-11-24T15:00:00Z"), sessions)?.id).toBe("ny-am"); // 10:00
    expect(getActiveSession(new Date("2026-11-25T02:00:00Z"), sessions)?.id).toBe("asia"); // 21:00
    expect(getActiveSession(new Date("2026-11-24T16:30:00Z"), sessions)).toBeNull(); // 11:30
  });
});

describe("getSessionStatus", () => {
  it("is closed on a Monday", () => {
    expect(status("2026-11-23T15:00:00Z")).toMatchObject({ kind: "closed", label: "Closed · Monday" });
  });

  it("counts down to the open before 9:30", () => {
    expect(status("2026-11-24T14:07:00Z")).toMatchObject({ kind: "pre", label: "Pre-market · opens in 23m", minutes: 23 });
  });

  it("is live at exactly 9:30 and shows time left", () => {
    expect(status("2026-11-24T14:30:00Z")).toMatchObject({ kind: "live", minutes: 90 });
    expect(status("2026-11-24T14:48:00Z").label).toBe("NY Killzone · 1h 12m left");
  });

  it("turns amber at exactly 11:00 until 13:30", () => {
    expect(status("2026-11-24T16:00:00Z")).toMatchObject({ kind: "caution", minutes: 150 });
    expect(status("2026-11-24T18:29:00Z").kind).toBe("caution");
  });

  it("is closed from 13:30", () => {
    expect(status("2026-11-24T18:30:00Z")).toMatchObject({ kind: "closed", label: "Closed" });
  });
});

describe("formatDuration", () => {
  it("formats minutes as hours and minutes", () => {
    expect(formatDuration(72)).toBe("1h 12m");
    expect(formatDuration(23)).toBe("23m");
    expect(formatDuration(120)).toBe("2h");
    expect(formatDuration(-5)).toBe("0m");
  });
});
