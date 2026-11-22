"use client";

import { Hourglass, ListChecks, Quote, Target, Wallet, Crosshair } from "lucide-react";
import { useNow } from "@/hooks/useNow";
import { getActiveSession, getSessionStatus, type SessionStatusKind } from "@/lib/time";
import { formatUSD } from "@/lib/utils";
import type { Tone } from "@/lib/tone";
import { usePlanStore } from "@/store/usePlanStore";
import { Card, FrameCard, GlowButton, HeatRow, SectionTitle, StatTile, StatusPill } from "@/components/ui-kit";

const kindTone: Record<SessionStatusKind, Tone> = { live: "green", caution: "amber", pre: "blue", closed: "muted" };

/**
 * Phase 1 preview of the Today page: real numbers from the plan, laid out the
 * way the finished page will be. Phase 2 adds the status engine, trade
 * counter buttons, news, timeline and the adherence calendar.
 */
export function TodayPreview() {
  const now = useNow();
  const plan = usePlanStore((s) => s.plan);
  const { todaysPlan, tradeStops, psychology, goals } = plan;

  const session = now ? getSessionStatus(now, plan.tradingWindows, plan.tradingDays) : null;
  const killzone = now ? getActiveSession(now, plan.sessions) : null;
  const lossUsed = Math.max(0, -todaysPlan.pnl);
  const room = Math.max(0, todaysPlan.lossLimit - lossUsed);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <FrameCard
        className="lg:col-span-7"
        title="plan / today / ny-session"
        live={session?.kind === "live" ? "LIVE" : "ET"}
        liveTone={session ? kindTone[session.kind] : "muted"}
      >
        <p className="eyebrow text-fg-3">Session right now</p>
        <p className="num mt-3 text-3xl font-semibold tracking-tight md:text-4xl" suppressHydrationWarning>
          {session ? session.label : "Checking the clock…"}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {session && (
            <StatusPill tone={session.kind === "live" ? "green" : "muted"} pulse={session.kind === "live"}>
              {killzone ? `${killzone.name} killzone` : "No killzone active"}
            </StatusPill>
          )}
          <StatusPill tone="muted">Model time {plan.tradingWindows.allowed.start}–{plan.tradingWindows.allowed.end} ET</StatusPill>
        </div>
        <p className="mt-6 text-sm text-fg-2">
          The full &ldquo;Can I trade right now?&rdquo; status engine (lockouts, trade limit, loss limit, news) arrives in
          Phase 2.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <GlowButton href="/pre-session" arrow>
            Start my session
          </GlowButton>
          <GlowButton href="/checklist" variant="secondary">
            Trade checklist
          </GlowButton>
        </div>
      </FrameCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 xl:grid-cols-2">
        <StatTile
          icon={ListChecks}
          label="Trades"
          info="Stop after 1 win, 3 losses, 3 breakevens, 2 losses + 1 win, or 3 trades."
          value={<>0<span className="text-fg-3">/{tradeStops.maxTrades}</span></>}
        />
        <StatTile
          icon={Wallet}
          label="Today's P&L"
          info="Today's drawdown/profit from your plan. Editable in Phase 2."
          value={todaysPlan.pnl}
          format="signed-usd"
          tone="green"
          valueTone={todaysPlan.pnl >= 0 ? "green" : "red"}
        />
        <StatTile
          icon={Crosshair}
          label="Risk per setup"
          info="Today's risk per setup, based on P&L."
          value={`${formatUSD(todaysPlan.riskPerSetupMin)}–${formatUSD(todaysPlan.riskPerSetupMax)}`}
          tone="violet"
        />
        <StatTile
          icon={Hourglass}
          label="Loss-limit room"
          info="How much you can still lose today before you must walk away."
          value={room}
          format="usd"
          tone="amber"
          hint={`of ${formatUSD(todaysPlan.lossLimit)} limit`}
        />
      </div>

      <Card className="lg:col-span-7">
        <SectionTitle>Limits</SectionTitle>
        <div className="mt-5 space-y-2.5">
          <HeatRow
            label="Daily loss limit"
            sublabel="Today's plan"
            value={`${formatUSD(lossUsed)} / ${formatUSD(todaysPlan.lossLimit)}`}
            ratio={lossUsed / todaysPlan.lossLimit}
          />
          <HeatRow label="Trades taken" sublabel="3 trade limit per day" value={`0 / ${tradeStops.maxTrades}`} ratio={0} />
          {goals.map((g) => (
            <HeatRow
              key={g.id}
              label={g.label}
              sublabel="Goal"
              value={`${formatUSD(g.current)} / ${formatUSD(g.target)}`}
              ratio={g.current / g.target}
              tone="blue"
            />
          ))}
        </div>
      </Card>

      <Card className="relative overflow-hidden lg:col-span-5">
        <Quote className="absolute -top-2 -right-2 size-28 text-primary/8" aria-hidden />
        <SectionTitle>Mantra</SectionTitle>
        <p className="mt-6 text-2xl leading-snug font-semibold tracking-tight">
          <span className="text-gradient">{psychology.mantras[0]}.</span>
        </p>
        <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
          {psychology.mantras.slice(1).map((line) => (
            <li key={line} className="flex gap-3 text-sm text-fg-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-primary-2" aria-hidden />
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-5 flex items-center gap-2 text-xs text-fg-3">
          <Target className="size-3.5" aria-hidden /> One line rotates in each visit from Phase 2.
        </p>
      </Card>
    </div>
  );
}
