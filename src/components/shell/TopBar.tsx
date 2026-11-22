"use client";

import { useNow } from "@/hooks/useNow";
import { formatETClock, formatETDate, getSessionStatus, type SessionStatusKind } from "@/lib/time";
import { formatUSD } from "@/lib/utils";
import type { Tone } from "@/lib/tone";
import { usePlanStore } from "@/store/usePlanStore";
import { HeatRow, LiveDot, StatusPill } from "@/components/ui-kit";
import { Brand } from "./Brand";

const sessionTone: Record<SessionStatusKind, Tone> = {
  live: "green",
  caution: "amber",
  pre: "blue",
  closed: "muted",
};

/**
 * Glass status strip on every page: ET clock, session, trades, loss limit, status.
 * Phase 1: the status badge only looks at the time window. Phase 2 swaps in the
 * full status engine (lockouts, trade limit, loss limit, news).
 */
export function TopBar() {
  const now = useNow();
  const plan = usePlanStore((s) => s.plan);

  const session = now ? getSessionStatus(now, plan.tradingWindows, plan.tradingDays) : null;
  const lossUsed = Math.max(0, -plan.todaysPlan.pnl);
  const lossLimit = plan.todaysPlan.lossLimit;

  const badge: { tone: Tone; text: string } | null = !session
    ? null
    : session.kind === "live"
      ? { tone: "green", text: "Clear to trade" }
      : session.kind === "caution"
        ? { tone: "amber", text: "Caution" }
        : { tone: "red", text: "No trading" };

  return (
    <header className="glass sticky top-0 z-30 border-b border-line">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-3 px-4 md:gap-4 md:px-8">
        <Brand className="lg:hidden [&>span:last-child]:hidden sm:[&>span:last-child]:flex" />

        {/* ET clock */}
        <div className="flex min-w-[88px] flex-col leading-tight" aria-live="off">
          <time className="num text-[15px] font-semibold tracking-tight" suppressHydrationWarning>
            {now ? formatETClock(now) : "--:--:--"}
          </time>
          <span className="num text-[10px] tracking-[0.14em] text-fg-3 uppercase">
            {now ? formatETDate(now) : " "} · ET
          </span>
        </div>

        {/* Session status */}
        {session && (
          <span className="hidden items-center gap-2 rounded-full border border-line-strong bg-surface/50 px-3 py-1.5 text-xs text-fg-2 md:inline-flex">
            <LiveDot tone={sessionTone[session.kind]} pulse={session.kind === "live"} />
            <span className="num whitespace-nowrap">{session.label}</span>
          </span>
        )}

        <div className="flex-1" />

        {/* Trades counter (live in Phase 2) */}
        <span className="hidden items-center gap-2 rounded-full border border-line bg-surface-raised/40 px-3 py-1.5 text-xs text-fg-2 lg:inline-flex">
          Trades
          <span className="num font-semibold text-fg">0/{plan.tradeStops.maxTrades}</span>
        </span>

        {/* Loss limit (live in Phase 2) */}
        <HeatRow
          compact
          className="hidden w-52 xl:flex"
          label="Loss limit"
          value={`${formatUSD(lossUsed)} / ${formatUSD(lossLimit)}`}
          ratio={lossLimit > 0 ? lossUsed / lossLimit : 0}
        />

        {badge && (
          <StatusPill tone={badge.tone} size="lg" pulse={badge.tone === "green"} className="px-3 py-1.5 text-xs md:px-4 md:py-2">
            {badge.text}
          </StatusPill>
        )}
      </div>
    </header>
  );
}
