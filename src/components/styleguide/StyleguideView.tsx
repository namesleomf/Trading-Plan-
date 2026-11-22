"use client";

import { useState, type ReactNode } from "react";
import { Hourglass, ListChecks, Palette, ShieldCheck, Trophy, TrendingDown, Wallet } from "lucide-react";
import {
  Card,
  ChecklistItem,
  DayCell,
  DiamondBadge,
  EmptyState,
  EyebrowLabel,
  EyebrowPill,
  FrameCard,
  GlowButton,
  HeatRow,
  PageHeader,
  ProgressRing,
  SectionTitle,
  SegmentedControl,
  StatTile,
  StatusPill,
  TagPill,
  Tile,
  type DayOutcome,
} from "@/components/ui-kit";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Bias, EntryType } from "@/data/types";

const SWATCHES = [
  ["--bg", "Background"],
  ["--surface", "Surface"],
  ["--surface-raised", "Raised"],
  ["--text", "Text"],
  ["--text-2", "Text 2"],
  ["--text-3", "Text 3"],
  ["--primary", "Primary"],
  ["--primary-2", "Violet"],
  ["--gold", "Gold"],
  ["--green", "Green"],
  ["--amber", "Amber"],
  ["--red", "Red"],
] as const;

// November 2026 starts on a Sunday. Demo outcomes only — real data comes in Phase 2.
const DEMO_OUTCOMES: Record<number, DayOutcome> = { 3: "followed", 4: "followed", 5: "broke", 6: "followed", 10: "followed", 12: "followed", 13: "broke", 17: "followed", 18: "followed", 19: "followed" };

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <SectionTitle>{title}</SectionTitle>
      {children}
    </section>
  );
}

export function StyleguideView() {
  const [bias, setBias] = useState<Bias | null>("bullish");
  const [side, setSide] = useState<"long" | "short">("long");
  const [entryType, setEntryType] = useState<EntryType["id"]>("type2a");
  const [checks, setChecks] = useState<Record<string, boolean>>({ a: true, b: false, c: false });
  const [heat, setHeat] = useState(0.45);
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <div className="space-y-14">
      <PageHeader
        eyebrow={<EyebrowPill dot="green" label="Live · NY AM" />}
        title="Midnight Desk."
        highlight="The styleguide."
        subtitle="Every building block of the app in one place. This page is hidden from the navigation."
        actions={
          <>
            <GlowButton variant="ghost" href="/">
              Back to Today
            </GlowButton>
          </>
        }
      />

      <Block title="Colour tokens">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SWATCHES.map(([token, name]) => (
            <div key={token} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="h-16 border-b border-line" style={{ background: `var(${token})` }} />
              <div className="p-3">
                <div className="text-sm font-medium">{name}</div>
                <div className="num text-xs text-fg-3">{token}</div>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Typography">
        <Card className="space-y-5">
          <div className="text-5xl leading-[1.05] font-bold tracking-[-0.03em]">
            Price moves. <span className="text-gradient">See why.</span>
          </div>
          <div className="text-2xl font-semibold tracking-tight">Section heading, DM Sans 600</div>
          <p className="max-w-2xl text-fg-2">
            Body text in DM Sans. Calm, readable and slightly muted so headings and numbers stand out.
          </p>
          <div className="num text-3xl font-semibold">09:41:07 · $1,182.50 · 3/3</div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="eyebrow text-primary">Eyebrow label</span>
            <span className="eyebrow text-fg-3">Muted eyebrow</span>
          </div>
        </Card>
      </Block>

      <Block title="Eyebrows & badges">
        <div className="flex flex-wrap items-center gap-4">
          <EyebrowPill label="Latest" meta="Plan v2026" arrow />
          <EyebrowPill dot="green" label="Live · NY AM" />
          <EyebrowPill dot="amber" label="News in 3m" pulse={false} />
          <EyebrowLabel>Pre-session</EyebrowLabel>
        </div>
        <DiamondBadge>The playbook</DiamondBadge>
      </Block>

      <Block title="Status & tags">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill tone="green" pulse>
            Clear to trade
          </StatusPill>
          <StatusPill tone="amber">Caution</StatusPill>
          <StatusPill tone="red">Locked</StatusPill>
          <StatusPill tone="blue">Pre-market</StatusPill>
          <StatusPill tone="muted">Closed</StatusPill>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill tone="green" size="lg" pulse>
            Clear to trade
          </StatusPill>
          <StatusPill tone="amber" size="lg">
            Caution
          </StatusPill>
          <StatusPill tone="red" size="lg">
            Locked, walk away
          </StatusPill>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TagPill variant="long" />
          <TagPill variant="short" />
          <TagPill variant="required" />
          <TagPill variant="optional" />
          <TagPill variant="reversal" />
          <TagPill variant="continuation" />
          <TagPill variant="hard" />
          <TagPill variant="principle" />
        </div>
      </Block>

      <Block title="Buttons">
        <div className="flex flex-wrap items-center gap-4">
          <GlowButton arrow>Start my session</GlowButton>
          <GlowButton variant="secondary" arrow>
            Try the checklist
          </GlowButton>
          <GlowButton variant="ghost" arrow>
            Open playbook
          </GlowButton>
          <GlowButton variant="danger">I&apos;m done for today</GlowButton>
          <GlowButton disabled>Disabled</GlowButton>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <GlowButton size="sm" arrow>
            Small
          </GlowButton>
          <GlowButton size="lg" arrow>
            Large
          </GlowButton>
          <GlowButton size="lg" variant="secondary" arrow>
            Large secondary
          </GlowButton>
        </div>
      </Block>

      <Block title="Segmented controls">
        <div className="flex flex-wrap items-center gap-4">
          <SegmentedControl
            label="Bias"
            value={bias}
            onChange={setBias}
            options={[
              { value: "bullish", label: "Bullish" },
              { value: "bearish", label: "Bearish" },
              { value: "ranging", label: "Ranging" },
            ]}
          />
          <SegmentedControl
            label="Direction"
            size="sm"
            value={side}
            onChange={setSide}
            options={[
              { value: "long", label: "Long" },
              { value: "short", label: "Short" },
            ]}
          />
        </div>
        <SegmentedControl
          label="Entry model type"
          fullWidth
          value={entryType}
          onChange={setEntryType}
          options={[
            { value: "type1", label: "Type 1" },
            { value: "type2a", label: "Type 2(a)" },
            { value: "type2b", label: "Type 2(b)" },
            { value: "type3", label: "Type 3" },
          ]}
        />
        <Tabs defaultValue="pnl">
          <TabsList>
            <TabsTrigger value="pnl">P&amp;L</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>
          <TabsContent value="pnl" className="text-sm text-fg-2">
            Tabs (shadcn/Radix) share the gold active pill.
          </TabsContent>
          <TabsContent value="news" className="text-sm text-fg-2">
            Second tab panel.
          </TabsContent>
        </Tabs>
      </Block>

      <Block title="Stat tiles">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatTile icon={ListChecks} label="Trades" info="Trades taken today out of 3." value={<>1<span className="text-fg-3">/3</span></>} />
          <StatTile icon={Wallet} label="Today's P&L" info="Profit or loss today." value={14} format="signed-usd" tone="green" valueTone="green" delta={{ label: "+0.03%", tone: "green" }} />
          <StatTile icon={TrendingDown} label="Worst trade" info="Largest loss." value={-166} format="signed-usd" tone="red" valueTone="red" delta={{ label: "−1.46%", tone: "red" }} />
          <StatTile icon={Trophy} label="Goal: 100K funding" info="Progress toward funding." value={50000} format="compact" tone="gold" hint="of 100K" />
        </div>
      </Block>

      <Block title="Frame card">
        <FrameCard title="plan / checklist / verdict">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="eyebrow text-fg-3">Verdict</p>
              <p className="num mt-2 text-6xl font-bold tracking-tight text-green">A+</p>
              <p className="mt-2 text-sm text-fg-2">All required items ticked · 6 confluences</p>
            </div>
            <ProgressRing value={0.86} tone="green" label="Checklist score">
              <span className="num text-xl font-semibold">86%</span>
            </ProgressRing>
          </div>
        </FrameCard>
      </Block>

      <Block title="Heat rows & rings">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="space-y-2.5">
            <HeatRow label="Daily loss limit" sublabel="Green below 70%" value="$30 / $85" ratio={30 / 85} />
            <HeatRow label="Daily loss limit" sublabel="Amber from 70%" value="$64 / $85" ratio={64 / 85} />
            <HeatRow label="Daily loss limit" sublabel="Red at 100%" value="$85 / $85" ratio={1} />
            <HeatRow label="Interactive" sublabel="Drag the slider" value={`${Math.round(heat * 100)}%`} ratio={heat} />
            <input
              type="range"
              min={0}
              max={1.1}
              step={0.01}
              value={heat}
              onChange={(e) => setHeat(Number(e.target.value))}
              className="w-full accent-(--primary)"
              aria-label="Heat ratio"
            />
            <HeatRow compact label="Loss limit" value="$0 / $85" ratio={0} />
          </Card>
          <Card className="flex flex-wrap items-center justify-around gap-6">
            {[0.3, 0.75, 1].map((v) => (
              <ProgressRing key={v} value={v} label={`${v * 100}% used`}>
                <div>
                  <div className="num text-lg font-semibold">{Math.round(v * 100)}%</div>
                  <div className="text-[11px] text-fg-3">used</div>
                </div>
              </ProgressRing>
            ))}
          </Card>
        </div>
      </Block>

      <Block title="Checklist items">
        <div className="grid gap-2.5 lg:grid-cols-2">
          <ChecklistItem label="Record live session" required checked={!!checks.a} onCheckedChange={(v) => setChecks((c) => ({ ...c, a: v }))} />
          <ChecklistItem label="SMT (optional)" required={false} checked={!!checks.b} onCheckedChange={(v) => setChecks((c) => ({ ...c, b: v }))} />
          <ChecklistItem
            label="Raid"
            description="Did we take significant H/L liquidity?"
            required
            checked={!!checks.c}
            onCheckedChange={(v) => setChecks((c) => ({ ...c, c: v }))}
          />
          <ChecklistItem label="Disabled item" required checked={false} onCheckedChange={() => {}} disabled />
        </div>
      </Block>

      <Block title="Plan-adherence calendar">
        <Card className="max-w-xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-semibold">November 2026</span>
            <span className="flex gap-3 text-xs text-fg-3">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-green" />Followed plan</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-red" />Broke a rule</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-gold" />Today</span>
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="eyebrow pb-1 text-center text-[10px] text-fg-3">
                {d}
              </div>
            ))}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const weekday = (day - 1) % 7;
              return (
                <DayCell
                  key={day}
                  day={day}
                  outcome={DEMO_OUTCOMES[day] ?? "none"}
                  today={day === 22}
                  muted={weekday === 0 || weekday === 1 || weekday === 6}
                />
              );
            })}
          </div>
        </Card>
      </Block>

      <Block title="Tiles, switch, accordion, dialog">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="space-y-4">
            <Tile className="flex items-center justify-between">
              <span className="text-sm">Inner tile with a switch</span>
              <Switch checked={switchOn} onCheckedChange={setSwitchOn} aria-label="Demo switch" />
            </Tile>
            <Dialog>
              <DialogTrigger asChild>
                <GlowButton variant="secondary">Open a dialog</GlowButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Glass dialog</DialogTitle>
                  <DialogDescription>Modals use the glass surface, like the top bar and mobile nav.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <GlowButton>Got it</GlowButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
          <Card className="py-2 md:py-2">
            <Accordion type="single" collapsible defaultValue="poi">
              <AccordionItem value="poi">
                <AccordionTrigger>POI (pro &amp; opposing)</AccordionTrigger>
                <AccordionContent>mSnR: Support, Resistance, SBR, RBS, GAP</AccordionContent>
              </AccordionItem>
              <AccordionItem value="structure">
                <AccordionTrigger>Structure</AccordionTrigger>
                <AccordionContent>BoS: Swing, Major, Minor, Micro</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>
      </Block>

      <Block title="Empty state">
        <div className="grid gap-5 lg:grid-cols-2">
          <EmptyState icon={Hourglass} title="No news added yet">
            Add today&apos;s red-folder events and the app will block the ±5 minute window.
          </EmptyState>
          <EmptyState icon={ShieldCheck} title="Locked for today" badge={<StatusPill tone="red">Locked</StatusPill>}>
            Come back tomorrow. Live to trade another day.
          </EmptyState>
        </div>
      </Block>

      <p className="flex items-center gap-2 text-xs text-fg-3">
        <Palette className="size-3.5" aria-hidden /> Toggle the theme in the sidebar to check Paper White.
      </p>
    </div>
  );
}
