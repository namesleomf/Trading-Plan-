# Build Prompt: "Plan" — My Trading Plan Dashboard

> **How to use this prompt (read me first, Leo):**
> 1. Make a new empty folder (e.g. `trading-plan-app`) and open it in Claude Code.
> 2. Put this file in the folder as `SPEC.md`, and put the 9 reference screenshots in a subfolder called `design-refs/` (the zip I gave you already has this layout). Then tell Claude Code: *"Read SPEC.md, look at every image in design-refs/, then start Phase 1."*
> 3. Let it build **one phase at a time**. After each phase, open the app in your browser, click around, and only then say "next phase". This keeps bugs small and easy to fix.

---

## 1. Role & goal

You are a senior front-end engineer and product designer. Build me a **personal web app that turns my trading plan into an interactive dashboard**. Right now my plan lives in a Google Sheet that I scroll through. I want an app I open before and during the New York session that **tells me what to do, checks me against my rules, and stops me from breaking them**.

It should feel like a premium trading tool: **modern, sleek, rounded, calm, dark by default**. It is not a journal and not a charting tool. It is my plan, made interactive.

**About me:** I'm new to coding ("vibe coding"). As you work:
- Explain each step in plain English, in a sentence or two, before you do it.
- When you finish a phase, tell me exactly what command to run and what URL to open, and what I should see.
- If something breaks, explain what went wrong simply before fixing it.
- Don't add extra features I didn't ask for without checking with me.

---

## 2. Tech stack (use exactly this)

| Purpose | Tool |
|---|---|
| Framework | **Next.js (latest, App Router) + React + TypeScript** |
| Styling | **Tailwind CSS v4** |
| UI building blocks | **shadcn/ui** (built on Radix UI) for dialogs, tabs, switches, accordions, tooltips |
| Animation | **Framer Motion** (subtle only) |
| State + saving | **Zustand** with the `persist` middleware → saves to the browser's `localStorage` |
| Icons | **lucide-react** |
| Dates/times | **date-fns** + **date-fns-tz** |
| Tests | **Vitest** for the logic functions (risk math, time windows, trade counter) |

- **No backend, no login, no database** for now. Everything saves in the browser. (Add a JSON export/import so I never lose my data; see Settings.)
- Keep code organised: `src/app` (pages), `src/components`, `src/data` (my plan content), `src/lib` (logic and calculations), `src/store` (Zustand).

### ⚠️ Time zone rule (very important)
**All time logic must run in `America/New_York` (ET)**, whatever time zone my computer is set to. Make one helper (`src/lib/time.ts`) that every component uses for "now in ET", session windows, and "is today a trading day". Never use the raw browser local time for trading logic. Handle daylight saving correctly. Write Vitest tests for this.

---

## 3. Core architecture idea: the plan is data, not hard-coded text

Put my entire trading plan in **one typed data file**: `src/data/plan.ts` (with TypeScript types in `src/data/types.ts`). Every page reads from the store, and the store is seeded from this file.

- I must be able to **edit any rule, checklist item, number, or list** from the app's Settings page later, without touching code.
- A "Reset to default plan" button restores the original `plan.ts`.
- Checklist items should have: `id`, `label`, optional `description`, `required: boolean` (hard rule vs nice-to-have), and optional `weight` for grading.

The full content of my plan is in **Section 7** below. Seed `plan.ts` with all of it, word for word, fixing only obvious typos (e.g. "METHOLOGY" → "Methodology").

---

## 4. Design system: "Midnight Desk"

**Vibe:** a premium orderflow / prop-firm terminal. Deep midnight navy fading to black, a soft blue "spotlight" glow, big bold headings with a gradient, pill-shaped everything, numbers in monospace. Calm and expensive, not "casino".

> **Reference screenshots:** they're in the `design-refs/` folder. **Open and look at every image before writing any UI code**, and match the *feel*: colours, glow, spacing, pills, cards. **Do not copy any logo, brand name, or exact layout**; these are inspiration only. What I like in each:
> - `01-glow-hero-pill-cta.jpg`: navy→black background with a blue radial glow at the top, "LATEST | v1.0 →" eyebrow pill, two-line headline where line 2 is a light-blue gradient, dark pill button with a glowing bottom edge, tiny letter-spaced uppercase labels.
> - `02-mono-black-minimal.jpg`: pure black, monochrome, outlined pill buttons, faint spotlight, very minimal.
> - `03-eyebrow-chart-card-status-pill.jpg`: "— EYEBROW" label with a leading line, white headline + blue sub-headline, chart card with a green-dot status pill ("● Grind"), legend row, solid blue CTA with an arrow tile.
> - `04-platform-badge-browser-frame.jpg`: faint starfield dots in the background, "◆ THE PLATFORM ◆" badge with diamond-ended lines, white→lavender gradient headline, a card framed like a browser window with a "● LIVE" indicator.
> - `05-segmented-tabs-heat-table.jpg`: "● New" outlined pill, white→blue→violet gradient headline, gradient full-width CTA, segmented tabs, data table with tinted heat bars behind numbers and a red event pill.
> - `06-trade-cards-long-short.jpg`: list cards with bold symbol, blue LONG / red SHORT pills, red/green P&L right-aligned, muted label/value grid, section titles with a short vertical blue accent bar on the left.
> - `07-stat-tiles-icon-segmented.jpg`: 2-column stat tiles with a rounded tinted icon square + label + ⓘ + big value; segmented control with a gold active pill.
> - `08-stat-rows-calendar-today.jpg`: stat rows with icon tiles and coloured % change; calendar with P&L/News toggle, rounded day cells, red-tinted loss day, gold outline on today.
> - `09-mono-calendar-floating-nav.jpg`: charcoal, mono uppercase labels, green-tinted profit days with green border, **floating rounded bottom nav bar** with a highlighted green "Add" button.

### 4.1 Colour tokens (CSS variables, dark theme is the default)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#05070D` | page background (near-black navy) |
| `--bg-glow` | radial gradient `rgba(59,130,246,0.18)` → transparent | spotlight glow at top of every page, behind the hero card |
| `--surface` | `#0B1120` | cards |
| `--surface-raised` | `#111A2E` | hovered cards, inputs, icon tiles |
| `--border` | `rgba(148,163,255,0.08)` | 1px card borders |
| `--text` | `#F4F6FF` | headings, values |
| `--text-2` | `#9AA4BF` | body text, labels |
| `--text-3` | `#5B6582` | muted / timestamps |
| `--primary` | `#3B82F6` | primary buttons, active nav, accent bars, icons |
| `--primary-2` | `#8B7CF6` | violet end of gradients |
| `--gold` | `#D9A955` | active segmented-control pill, "today" outline |
| `--green` | `#22C55E` | allowed / win / checked / LIVE dot |
| `--amber` | `#F59E0B` | caution / approaching a limit |
| `--red` | `#EF4444` | blocked / loss / limit hit / SHORT |

- **Gradient headline text:** `linear-gradient(90deg, #F4F6FF, #93B4FF 55%, #8B7CF6)` with `background-clip: text`. Use it on the *second line or key word* of page titles only (e.g. "Today. **Clear to trade.**").
- **Tints:** green/red/blue at 10–14% opacity for pill backgrounds, heat bars, and calendar cells; the solid colour for the text/border.
- **Background texture:** a very faint dot/star pattern (opacity ≤ 0.06) on the page background, plus the top spotlight glow.
- **Light theme ("Paper White")** still exists as a toggle, but dark is the priority; make dark perfect first.

### 4.2 Typography
- **UI and headings:** `DM Sans`. Page titles 36–48px, weight 700, letter-spacing `-0.03em`, tight line-height (1.05).
- **Numbers, times, prices, counters, and small uppercase labels:** `IBM Plex Mono` with `tabular-nums`.
- **Eyebrow labels:** 11–12px, uppercase, letter-spacing `0.18em`, `--primary` or `--text-3`, optionally with a short leading line ("— PRE-SESSION").

### 4.3 Shape, depth, motion
- Cards `rounded-3xl` (24px), inner tiles `rounded-2xl`, buttons/inputs/tabs/badges **fully pill-shaped** (`rounded-full`).
- Depth = 1px `--border` + very soft shadow + the glow. No heavy drop shadows.
- Glassmorphism (`backdrop-blur-xl`, semi-transparent surface) only on the top bar, the floating mobile nav, and modals.
- Motion 150–250ms ease-out; checkmarks animate when ticked; the "● LIVE" dot pulses gently; numbers count up when they change. Respect `prefers-reduced-motion`.
- Layout: max content width ~1280px, 12-column grid, 24–32px padding. Accessible contrast and visible focus rings.

### 4.4 Reusable components (build these once in Phase 1, use them everywhere)
- `<PageHeader>`: eyebrow pill + big title with gradient key word + one-line subtitle, sitting in the spotlight glow.
- `<EyebrowPill>`: e.g. "● LIVE · NY AM" or "LATEST | Plan v2026 →" (outlined, small, dot optional).
- `<SectionTitle>`: title with a 3px × 18px vertical `--primary` accent bar on its left (from ref 06).
- `<StatTile>`: rounded tinted icon square + label + ⓘ tooltip + big mono value + optional coloured delta (refs 07/08).
- `<StatusPill>`: dot + text, tinted background ("● Clear to trade", "● Caution", "● Locked").
- `<TagPill>`: LONG (blue), SHORT (red), REQUIRED (red outline), OPTIONAL (muted), REVERSAL/CONTINUATION.
- `<SegmentedControl>`: pill track with gold active pill (ref 07); used for bias pickers, entry-type picker, Long/Short.
- `<GlowButton>`: primary = blue→violet gradient pill with arrow tile (ref 03/05); secondary = dark pill with a glowing bottom edge (ref 01); ghost = outlined pill (ref 02).
- `<FrameCard>`: card with a fake browser-style top bar (three dots + title + "● LIVE"), used for the hero status card on Today (ref 04).
- `<HeatRow>`: list/table row with a tinted bar behind the value showing how close it is to a limit (ref 05); used for risk limits and the trade counter.
- `<DayCell>`: rounded calendar cell, green/red tint for outcome, gold outline for today (refs 08/09).
- `<ChecklistItem>`: pill-shaped row, circle check on the left, label, `<TagPill>` on the right; ticks with a small spring.

### 4.5 Where the patterns go in this app
- **Top bar:** glass, with ET clock (mono), `<StatusPill>`, "● LIVE · NY AM" session pill, trades `1/3`, a mini loss-limit `<HeatRow>`.
- **Today:** `<PageHeader>` with gradient status word → `<FrameCard>` hero status → 2-col `<StatTile>` grid (trades, P&L, risk/setup, loss-limit room) → session timeline card → news + mantra cards. Add a small **plan-adherence calendar** (`<DayCell>`s showing green = followed plan / red = broke a rule / gold outline = today), filled from the daily lockout and trade-counter data the app already stores; no new trading data needed.
- **Trade Checklist:** entry Type 1/2(a)/2(b)/3 as a `<SegmentedControl>`; verdict panel as a `<FrameCard>` with a big grade.
- **Risk:** limits as `<HeatRow>`s; calculators in cards with mono inputs.
- **Rules / Playbook:** `<SectionTitle>` groups, `<TagPill>`s for hard rule vs principle, optional vs required.

---

## 5. Navigation

- **Desktop:** a **left sidebar** (collapsible to icons only) with the app name at the top, nav items with icons in the middle, theme toggle and Settings at the bottom. The active item gets a rounded highlighted pill.
- **Top bar** (always visible on every page) shows my **live status strip**:
  - Current time in ET (ticking, mono font)
  - Session status pill: e.g. `NY Killzone · 1h 12m left` / `Pre-market · opens in 23m` / `Closed`
  - Trade counter: `Trades 1/3`
  - Today's P&L vs loss limit as a small progress bar
  - A big status badge: **🟢 CLEAR TO TRADE**, **🟡 CAUTION**, or **🔴 LOCKED, WALK AWAY**
- **Mobile/tablet:** sidebar becomes a **floating, rounded, glass bottom nav bar** (like ref 09): Today, Pre-Session, a highlighted centre **Checklist** button (tinted square, like the green "Add" button), Risk, More. "More" opens a bottom sheet with the other sections. (I don't trade on my phone, but I want to read my plan on it.)
- Keyboard shortcuts: `1`–`9` jump to sections, `[` collapses the sidebar.

### Sections (nav items, in this order)
1. **Today**: command centre
2. **Pre-Session**: setup & top-down analysis
3. **Trade Checklist**: interactive setup validator (the most important page)
4. **Risk**: risk settings & calculators
5. **Rules**: all my rules
6. **Playbook**: methodology & chart-analysis reference
7. **Mindset**: psychology & losing-day protocol
8. **Goals & Lockouts**
9. **Settings**

---

## 6. Pages in detail

### 6.1 Today (Command Centre), the home page
A card grid that answers **"Can I trade right now, and how?"** at a glance.

- **Hero status card:** huge green/amber/red state with the *reason*. Logic (evaluate in this order, first match wins):
  1. Daily lockout active → 🔴 "Locked for today, come back tomorrow"
  2. Not a trading day (Monday, Saturday, Sunday) → 🔴 "No trading today (Monday = NO)"
  3. Trade limit reached (see trade counter rules) → 🔴
  4. Daily loss limit hit → 🔴
  5. Outside my trading window → 🔴 "Outside the NY window"
  6. Inside the NYSE-open no-entry zone (9:30–9:40 ET) → 🟡 "No entries: early buyers/sellers liquidity"
  7. Within 5 minutes before/after a red-folder news event I've entered → 🟡 "News in 3m: no entries"
  8. Otherwise → 🟢 "Clear to trade. Follow your model."
- **Session timeline:** a horizontal bar from midnight to midnight ET showing Asia, London, Frankfurt, NY AM, NY Lunch, NY PM as coloured blocks, my trading window highlighted, and a "now" marker that moves.
- **Trade counter card:** buttons to log a trade result: **Win / Loss / Breakeven** (each with an optional $ amount). Shows `0 out of 3`. Automatically ends the day when any stop condition is met: **1 win**, **3 losses**, **3 breakevens**, **2 losses + 1 win**, or **3 trades total**. When ended, trigger the lockout flow (see Mindset). Include an "undo last" button.
- **Today's plan card (based on P&L):** today's drawdown/profit, today's risk per setup, today's loss limit. Editable inputs; show remaining room to the loss limit as a progress ring (amber at 70%, red at 100%).
- **News card:** I manually add today's red-folder events (time + name), since I check ForexFactory myself. The app counts down to each and blocks the ±5 min window. Include a quick link button to ForexFactory's calendar.
- **Mantra card:** rotates one of my psychology lines each visit ("Patience gets me paid" etc.).
- **Goals mini-card:** progress toward 100K funding and 10K payouts.
- **"Start my session" button** → goes to Pre-Session. **"I'm done for today" button** → lockout flow.

### 6.2 Pre-Session
A step-by-step flow I tick through before 9:30 ET. Progress bar at the top. Resets automatically each new trading day (ET).
1. **Workflow setup checklist:** accounts setup, monitors, laptop tabs, Chrome tab group (from my plan).
2. **Lockout tools check:** NextDNS / ColdTurkey / FocusMe / StayFocused running.
3. **Top-down analysis:** one row per timeframe **Monthly → Weekly → Daily → 4h → 1h → 30m → 15m**. For each: a bias selector (Bullish / Bearish / Ranging) + a short notes box. Show what each timeframe is *for* (e.g. "Monthly, Weekly: bias & direction", "Daily: refined HTF zones", "4h/1h/30m: intraday bias", "15m: setups, entries, exits").
   - Auto-summary: "HTF bias: Bullish. **Rule: do not sell.**" If my 4h and 15m disagree, show an amber warning.
4. **Market condition picker:** Ranging / Accumulation / Distribution / Redistribution / Reaccumulation / SnD flip, showing whether it's reversal or continuation.
5. **Chart prep checklist:** map pair + correlated pair, mark session H/Ls, killzone boxes, volume profile levels (VAH/VAL/POC/HVN/LVN), major HSnR levels, trading-window horizontal line.
6. **Before-a-trade commitments:** record live session, accept the potential outcome, emotionally stable and calm, correct risk applied. These are tick-boxes; I can't reach "Session ready ✅" until all required items are ticked.

### 6.3 Trade Checklist (the heart of the app)
An interactive **setup validator** I run *before every entry*. Laid out as a vertical stepper or a split view (checklist left, live verdict right).

- **Gate checks (automatic, from the store):** trading day? in window? not in NYSE-open zone? no news? under trade limit? not locked? If any fail → big red "DO NOT TAKE THIS TRADE" and the rest is greyed out.
- **Step 1, Trading model:** time (NY killzone), structure (BoS body close, trading range major/minor/micro), pre-requisites (HTF alignment 4H & 15M), then the model checklist.
- **Step 2, Validate POI:** every item from my "Validate POI" list as toggles.
- **Step 3, Entry model type:** pick **Type 1 / 2(a) / 2(b) / 3**. Each shows its own required sequence (e.g. Type 2(a): Raid → Engulfing candle close → Displacement candle → FVG inversion body close → Entry = body close).
  - **Type 1 shows a red "Risk: do not take" warning and cannot be marked valid.**
- **Step 4, Entry confluence:** multi-select chips for all confluences (VWAP aligned, 21 EMA aligned, SMT divergence, CVD divergence, IRL/ERL, etc.).
- **Step 5, Risk:** auto-fills risk per trade from the Risk page for the selected account; I confirm stop distance and it calculates contracts (see 6.4).
- **Live verdict panel:** shows a score and a grade **A+ / A / B / No Trade**. Rule: if *any* `required` item is unticked → **No Trade**, whatever the score. Confluences only raise the grade. Show which required items are missing.
- "Clear checklist" and "Log as taken" buttons (Log as taken → increments the trade counter flow on Today).

### 6.4 Risk
- **Risk settings card** (mirrors Tradovate's risk page): Loss protection (max loss per trade, daily loss limit $120, weekly loss limit, daily profit limit $200, trailing max drawdown), Profit controls, Trade guardrails. Some values are blank in my plan; show them as "Not set" with an edit button.
- **Personal (CFD) account calculator:** deposit $400, account size $618 → risk per trade = account size ÷ 19 (survive 19 losses in a row) → **$32**. Live recalculates when I change the account size.
- **Futures account calculator:** account 50K, available drawdown $2,000 → risk per trade = drawdown ÷ 10 consecutive losses → **$200**; show my plan's target range **$150–$200**. Also show the entry-model presets: **25K = $100, 50K = $200**.
- **Position size calculator:** pick instrument (MES, ES, MNQ, NQ, MYM, plus a custom "SPX500 CFD" where I enter $ per point), enter stop in points → shows contracts (rounded *down*) and actual $ risk. Use correct point values (MES $5/pt, ES $50/pt, MNQ $2/pt, NQ $20/pt, MYM $0.50/pt) and keep them editable.
- Put the formulas in `src/lib/risk.ts` with Vitest tests.
- Big reminder banner: **"Do not adjust the daily drawdown limit. Do not adjust the SL."**

### 6.5 Rules
- Group my rules into cards: **Lockout & limits**, **Trend & bias**, **Trade limits**, **Time & session**, **Where I never trade** (phone, work, family, car, clinic), **Discipline**.
- Hard rules get a red left border; principles get a neutral one.
- Optional daily "I've read my rules" acknowledgement that feeds the Pre-Session progress.
- Remove the duplicate rule (my plan lists "no trading outside the NY killzone" twice).

### 6.6 Playbook (reference library)
A clean, **searchable** reference of my methodology. Search box at the top filters across everything.
- Methodologies: Orderflow, mSnR, SMC, CRT, LIT, Inducement, OptionsFlow
- Chart analysis rules, drawing tools (live session vs journaling)
- POI types (mSnR & ICT/SMC), Structure, Liquidity (sessions, SMC, retail patterns), Inducement, Killzones with times, Volume profiles, CRT timeframes, Major HSnR levels
- Indicators, News rules, Market conditions, Strategy (Continuation model: low risk, high reward)
- Use accordions/collapsible cards so it's not a wall of text. Each item can have an optional note and an optional screenshot I upload later (store as data URL; keep it small).

### 6.7 Mindset
- My psychology lines as large, beautiful quote cards.
- **"If I make a mistake" protocol** as a numbered card: understand it's not too late → close the trade (in profit or at a loss) → identify the mistake and document it (text box that saves with today's date) → come back tomorrow → "Live to trade another day; starting over sucks."
- **Losing Day protocol / Lockout flow** (triggered by the trade counter, the loss limit, or the "I'm done for today" button):
  - Full-screen calm overlay: "You're done for today."
  - Checklist: Do not increase DLL → Manually lock out in Tradovate → Close your laptop → Come back tomorrow.
  - After confirming, the app enters **Locked** state until the next trading day at 00:00 ET: status goes red everywhere and the Trade Checklist is disabled. There is **no "unlock" button**. (Settings can only reset the lock with a 60-second wait + typing "I accept breaking my plan", so it's a real speed bump.)

### 6.8 Goals & Lockouts
- Goals with progress bars I update manually: **Get 100K in funding**, **Receive 10K in payouts**.
- Lockout setup steps (1. Select prop firm → 2. Set DLL → 3. Set DPL → 4. Block for the entire week) as a checklist with a "last done" date.
- Rule reminder: "If a challenge is passed, do not trade the funded account on the same day."

### 6.9 Settings
- **Plan editor:** edit every list/rule/number from Section 7 (add, remove, reorder items; toggle `required`).
- Theme toggle, accent colour picker.
- Active account selector (e.g. "Futures 50K", "Futures 25K", "CFD personal") used by Risk and the Trade Checklist.
- **Export plan + history as JSON / Import JSON** (with a preview + confirm before overwriting).
- Reset to default plan.

---

## 7. My trading plan content (seed `src/data/plan.ts` with this)

**LOCKOUTS:** 1. Select prop firm · 2. Set DLL · 3. Set DPL · 4. Block for the ENTIRE WEEK. Tools: NextDNS, ColdTurkey on PCs, FocusMe on PCs, StayFocused on phones.

**GOALS:** Get 100K in funding · Receive 10K in payouts.

**RULES:**
- Daily lockout = no trading (walk away)
- Daily loss limit = no trading (walk away)
- −2% loss (CFD) = walk away
- Do not trade against the trend
- If we have a 15m BoS and trading range, do not switch the bias
- If we are in a bullish BMS, do not sell · If we are in a bearish BMS, do not buy
- 3 trade limit per day. Stop after: 1 win · 3 losses · 3 breakeven trades · 2 losses and 1 win
- If a challenge is passed, do not trade the funded account on the same day
- Stop trading if the daily drawdown limit is hit · Do not adjust the daily drawdown limit · Do not adjust the SL
- No trading on your phone · at work · around family · in your car · at a clinic
- Do not trade outside the NY killzone · Do not trade during the Asian session
- Do not set trade limits when you're away from the charts · Do not set trade limits overnight when you're asleep
- Follow your system · Follow your risk management

**PSYCHOLOGY:** Patience gets me paid · Discipline keeps me in the game · Risk management is the only way · Keep it simple (no need to go higher than the 15m TF) · Focus on base hits.
If I make a mistake, understand: it's not too late → close the trade regardless of whether you're in profit or at a loss → identify your mistake and document it → come back tomorrow → live to trade another day; starting over sucks.

**METHODOLOGY:** Orderflow, mSnR, SMC, CRT, LIT, Inducement, OptionsFlow.

**WORKFLOW SETUP:**
- Accounts setup: TradingView account; $2,000 futures demo account (master); copy trader setup
- Office setup: Monitor 1: MES, MYM · Monitor 2: Google Docs trading plan, execution platform · Laptop: Tab 1 Tradovate accounts, Tab 2 TradeLocker accounts, Tab 3 prop firm dashboard(s), Tab 4 ForexFactory
- Laptop-only setup (Chrome tab group): Tab 1 (split view) TradingView & trading plan (NAS100/SPX500) · Tab 2 (split view) TradingView (MNQ/MES) · Tab 3 execution platform · Tab 4 ForexFactory

**TRADING DAYS & TIMEFRAMES:** Do not trade below the 15m TF (for analysis; entries are on the 1m per the entry model). Monday NO · Tuesday–Friday YES.
Monthly, Weekly = bias, direction · Daily = refined HTF zones · 4h, 1h, 30m = intraday bias · 15m = setups, entries, exits.

**TRADING PAIRS:** Only trade one pair: **SPX500 / MES**.

**INDICATORS:** ATR · SMC (LuxAlgo) · Equal H/L · Session volume profile.

**NEWS:** ForexFactory · No entries 5 minutes before/after red-folder news.

**CHART ANALYSIS:**
- Rules: do not delete present/past drawings · use the object tree to remove unwanted noise · map the pair and the correlated pair
- Style: top-down analysis, Monthly → Weekly → 4h → 1h → 30m → 15m
- Drawing tools: during live session only horizontal rays · journaling: box, trendlines
- Position sizing tool: save TV presets for every account size (account size, risk per trade)
- POI (pro & opposing): mSnR (Support, Resistance, SBR, RBS, GAP) · ICT/SMC (Mitigation, OB, IFC, RB, BB, IFVG optional, FVG optional)
- Structure: timeframes 4h, 1h · BoS pro & opposing (Swing, Major, Minor, Micro) · Trading range (Swing, Major, Minor, Micro) · Premium & discount optional (Major, Minor, Micro)
- Liquidity, sessions H/L: Asia, London, NY AM, NY Lunch, NY PM, Frankfurt, CRT H/L (HTF), swing points (HTF)
- Liquidity, pool: Equal H/L, relatively equal H/L, weak H/L, low resistance, 0.5 trading range PA, wick candle
- Liquidity, retail: trendline, S&R level, double T/B, triple T/B, flag, triangle, wedge, channel, head and shoulders, ascending/descending channel
- Liquidity, SMC: SMT, internal liq, external liq, weak H/L, old H/L, PDH/PDL, Monthly/Weekly/4h/1h H/L, imbalance, volume profile, LVN
- Inducement: weak H/L, old H/L, internal OB, SMT (fake OB), Major, Medium, Minor, External, mitigated OB
- Swing points: HTF
- Killzones (box & H/L, all ET): NY AM 9:30–11:00 · NY Lunch 12:00–13:00 · NY PM 13:30–16:00 · Asia 20:00–00:00 · London 02:00–05:00 · Frankfurt (time not set; make editable)
- Volume profiles: draw on a separate chart; map VAH, VAL, HVN, LVN, POC; types SVP, CVP, PWVP, CWVP
- Major horizontal SnR levels: horizontal line tool; use a line chart if needed; Daily, 4h, 1h
- CRT: Monthly, Weekly, Daily, 4h

**VALIDATE POI:** Pro-trend · Engulfing · Created during NY/London · Raid (did we take significant H/L liquidity?) · IFVG/FVG · BoS · Volume candles · Fresh and untested? · Located in OTE · Mitigates another POI · Aligned with QM shoulder (optional) · High volume bars · Aligned with HVN / LVN / VAH / VAL / POC · VWAP level · Inducement present/engineered · Liquidity.

**RISK SETTINGS:**
- Loss protection: Max loss per trade = (not set) · Daily loss limit = $120 · Weekly loss limit = (not set) · Daily profit limit = $200 · Trailing max drawdown = (not set)
- Profit controls: Max profit per trade, Daily profit trigger, Weekly profit trigger (all not set)
- Trade guardrails: Max time in trade, Risk settings lock, Lock settings if locked (all not set)

**RISK, PERSONAL:** Deposit $400 · Account size $618 · Today's risk per trade $32 (based on 19 losses in a row).

**RISK, FUTURES:** Based on 10 consecutive losses and available drawdown · Account size 50K · Available DD $2,000 · Risk per trade $150–$200.

**STRATEGY:** Continuation model: low risk, high reward.

**MARKET CONDITION:** Ranging · Accumulation (reversal) · Distribution (reversal) · Redistribution (continuation) · Reaccumulation (continuation) · SnD flip.

**BEFORE A TRADE:** Record live session · Accept the potential outcome · Be emotionally stable and calm · Apply correct risk · Daily lockout = no trading (walk away) · Daily loss limit = no trading (walk away) · Do not adjust the daily drawdown limit. Remember: 3 trade limit per day (1 win / 3 losses / 3 breakeven / 2 losses and 1 win).

**TODAY'S PLAN (based on P&L, editable daily):** Today's drawdown/profit = $14 · Today's risk per setup = $25–$30 · Today's loss limit = $85.

**TRADING WINDOW:** 9:30 AM – 1:30 PM ET (map on the chart with a horizontal line).

**TRADING MODEL:**
- Time: NY killzone, 9:30–11:00 AM ET
- Structure: BoS (body close) · Trading range: Major, Minor, Micro
- Pre-requisites: HTF alignment (4H & 15M)
- Checklist: Pair correlation · Raid · OTE 0.50 · Valid POI · I/FVG · Inducement · Liquidity · DOL · SMT (optional) · Volume profile alignment (VAH, VAL, POC, HVN, LVN)
- Valid POI: BoS (body close) · I/FVG · Volume profile alignment (HVN, LVN, VAH, VAL, POC) · Created in NY/London session · Raid · Aligned with the 15m trend · Based on the 15m TF or higher

**ENTRY MODEL:**
- Timeframe: 1m
- Rules: no entries during NYSE open (9:30), because of early buyers/sellers liquidity in the first 5–10 minutes after the open · Do not take any POIs right at the NY open
- Trade counter = 0 out of 3
- Risk: 25K account = $100 · 50K account = $200
- Prerequisites: trading model identified · valid POI · RTPOI / sweep · entry platform open · risk predetermined
- **Type 1:** RTPOI → *Risk, do not take*
- **Type 2(a):** Raid → Engulfing candle close → Displacement candle → FVG inversion (body close) → Entry = body close
- **Type 2(b):** Raid → Engulfing candle → Displacement → FVG inversion (optional) → CHoCH (body close) → Entry = body close
- **Type 3:** Raid → CHoCH (body close) → POI created / fresh mSnR zone → Valid POI created → i/FVG → Inducement / liquidity (internal) → Pullback to 0.5 OTE → Entry at RTPOI

**ENTRY CONFLUENCE:** VWAP aligned · 21 EMA aligned · MTF bias alignment (indicator) · SMT divergence (indicator) · CVD divergence · IRRL · IRL · ERL · HSnR level · TRVP level · QM shoulder · Multi-VP level alignment · CFD vs futures pair divergence · mSnR congestion zone · Retail liquidity · Trendline disrespected · Inducement · Gamma levels · Absorption · Aggression · TPO · Composite value areas · M/W/D VWAP levels · Horizontal SnR level.

**ENTRY TRIGGER:** *(empty in my plan; create the section with a placeholder so I can fill it in)*

**LOSING DAY?** Do not increase DLL · Manually lock out in Tradovate · Close your laptop · Come back tomorrow.

### Known gaps in my plan (use these defaults, all editable in Settings)
- **Two time windows:** "Trading window" is 9:30–1:30 ET but the trading model says "NY killzone 9:30–11:00". Default: allowed window = **9:30–11:00** (green), 11:00–13:30 = amber "Outside model time", after 13:30 = red. Make both editable.
- **Pairs:** plan says "only trade one pair: SPX500 / MES", but the setup mentions NAS100, MNQ and MYM. Default active pair = **MES/SPX500**; keep others as correlated/reference pairs.
- **Two risk numbers for futures:** $150–$200 (risk section) vs $200 for 50K (entry model). Show the range and use $200 as the calculator default.
- Blank risk settings and an empty Entry Trigger section: show as "Not set".

---

## 8. Build in phases (stop after each one and wait for me)

**Phase 1: Foundation**
Look at every image in `design-refs/` first. Scaffold the project, install the stack, set up the colour tokens + glow + fonts (Section 4), build all the reusable components from 4.4, sidebar + glass top bar + floating mobile nav, empty pages for all 9 sections (each with a `<PageHeader>`), `plan.ts` fully seeded, Zustand store with persistence, and `time.ts` with tests. Also make a hidden `/styleguide` page showing every component so I can check the look.
✅ *Done when:* I can click through all 9 sections, the `/styleguide` page looks like it belongs with the reference screenshots, the ET clock ticks in the top bar, and a refresh keeps my theme.

**Phase 2: Today + status engine**
Status logic (Section 6.1), session timeline, trade counter with stop conditions, today's plan, news countdown, mantra, goals mini-card. Tests for the status logic and trade counter.
✅ *Done when:* changing my computer's time zone doesn't change the session status, and logging 1 win locks the day.

**Phase 3: Trade Checklist**
Full validator with gate checks, entry types, grading, missing-item list.
✅ *Done when:* Type 1 can never be valid, and one missing required item forces "No Trade".

**Phase 4: Risk**
All calculators and the position sizer, with tests.
✅ *Done when:* account $618 shows $32, DD $2,000 shows $200, and MES with an 8-point stop at $200 risk shows 5 contracts.

**Phase 5: Pre-Session, Rules, Playbook, Mindset, Goals**
Including the lockout flow and daily auto-reset at 00:00 ET.

**Phase 6: Settings & polish**
Plan editor, export/import, reset, keyboard shortcuts, empty states, loading states, animations, responsive check at 375px / 768px / 1440px, accessibility pass.

---

## 9. Quality bar
- TypeScript strict mode, no `any`.
- `npm run build` must pass with zero errors before you say a phase is done.
- All tests pass (`npm test`).
- No console errors in the browser.
- Small, reusable components (e.g. one `<ChecklistItem>`, one `<StatCard>`, one `<StatusBadge>`) used everywhere for consistency.
- At the end of each phase, give me: (1) what you built, in plain English, (2) how to run it, (3) what to test by clicking, (4) anything you weren't sure about.

## 10. Out of scope (for now)
- Connecting to Tradovate, TradingView, or a broker API (the in-app lockout is a self-commitment screen, not a real broker lock)
- Accounts/login, cloud sync, trade journaling, charts of price data
- Scraping ForexFactory (I enter news times manually)
