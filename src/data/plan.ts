/**
 * Leo's trading plan — the single source of truth the app is seeded from.
 *
 * Copied from the Google Sheet (SPEC.md §7), fixing only obvious typos.
 * Everything here is editable in Settings later; "Reset to default plan"
 * restores exactly this file.
 */
import type { ChecklistItem, Plan, PlaybookEntry, Tag } from "./types";

/** Turn a label into a short, stable id, e.g. "Raid (did we…)" → "raid-did-we". */
function slug(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

/** Required checklist item (hard rule). */
function req(prefix: string, label: string, description?: string): ChecklistItem {
  return { id: `${prefix}.${slug(label)}`, label, required: true, ...(description ? { description } : {}) };
}

/** Optional checklist item (nice-to-have). */
function opt(prefix: string, label: string, description?: string): ChecklistItem {
  return { id: `${prefix}.${slug(label)}`, label, required: false, ...(description ? { description } : {}) };
}

function tag(prefix: string, label: string): Tag {
  return { id: `${prefix}.${slug(label)}`, label };
}

function entry(id: string, title: string, items: string[], note?: string): PlaybookEntry {
  return { id, title, items, ...(note ? { note } : {}) };
}

export const defaultPlan: Plan = {
  name: "Plan",
  version: "v2026",

  // ── LOCKOUTS ────────────────────────────────────────────────────────────
  lockout: {
    steps: [
      req("lockout", "Select prop firm"),
      req("lockout", "Set DLL", "Daily loss limit"),
      req("lockout", "Set DPL", "Daily profit limit"),
      req("lockout", "Block for the ENTIRE WEEK"),
    ],
    tools: [
      req("tools", "NextDNS"),
      req("tools", "ColdTurkey on PCs"),
      req("tools", "FocusMe on PCs"),
      req("tools", "StayFocused on phones"),
    ],
  },

  // ── GOALS ───────────────────────────────────────────────────────────────
  goals: [
    { id: "goal.funding", label: "Get 100K in funding", target: 100_000, current: 0 },
    { id: "goal.payouts", label: "Receive 10K in payouts", target: 10_000, current: 0 },
  ],

  // ── RULES ───────────────────────────────────────────────────────────────
  ruleCategories: [
    { id: "lockout", title: "Lockout & limits" },
    { id: "trend", title: "Trend & bias" },
    { id: "trade-limits", title: "Trade limits" },
    { id: "time", title: "Time & session" },
    { id: "where", title: "Where I never trade" },
    { id: "discipline", title: "Discipline" },
  ],
  rules: [
    { id: "rule.daily-lockout", text: "Daily lockout = no trading (walk away)", kind: "hard", category: "lockout" },
    { id: "rule.daily-loss-limit", text: "Daily loss limit = no trading (walk away)", kind: "hard", category: "lockout" },
    { id: "rule.cfd-2pct", text: "−2% loss (CFD) = walk away", kind: "hard", category: "lockout" },
    { id: "rule.stop-dd-hit", text: "Stop trading if the daily drawdown limit is hit", kind: "hard", category: "lockout" },
    { id: "rule.no-adjust-dd", text: "Do not adjust the daily drawdown limit", kind: "hard", category: "lockout" },
    { id: "rule.no-adjust-sl", text: "Do not adjust the SL", kind: "hard", category: "lockout" },

    { id: "rule.with-trend", text: "Do not trade against the trend", kind: "hard", category: "trend" },
    { id: "rule.keep-bias", text: "If we have a 15m BoS and trading range, do not switch the bias", kind: "hard", category: "trend" },
    { id: "rule.bullish-bms", text: "If we are in a bullish BMS, do not sell", kind: "hard", category: "trend" },
    { id: "rule.bearish-bms", text: "If we are in a bearish BMS, do not buy", kind: "hard", category: "trend" },

    { id: "rule.3-trades", text: "3 trade limit per day", kind: "hard", category: "trade-limits" },
    { id: "rule.stop-after", text: "Stop after: 1 win · 3 losses · 3 breakeven trades · 2 losses and 1 win", kind: "hard", category: "trade-limits" },
    { id: "rule.funded-same-day", text: "If a challenge is passed, do not trade the funded account on the same day", kind: "hard", category: "trade-limits" },

    { id: "rule.ny-killzone", text: "Do not trade outside the NY killzone", kind: "hard", category: "time" },
    { id: "rule.no-asia", text: "Do not trade during the Asian session", kind: "hard", category: "time" },
    { id: "rule.limits-away", text: "Do not set trade limits when you're away from the charts", kind: "hard", category: "time" },
    { id: "rule.limits-overnight", text: "Do not set trade limits overnight when you're asleep", kind: "hard", category: "time" },

    { id: "rule.no-phone", text: "No trading on your phone", kind: "hard", category: "where" },
    { id: "rule.no-work", text: "No trading at work", kind: "hard", category: "where" },
    { id: "rule.no-family", text: "No trading around family", kind: "hard", category: "where" },
    { id: "rule.no-car", text: "No trading in your car", kind: "hard", category: "where" },
    { id: "rule.no-clinic", text: "No trading at a clinic", kind: "hard", category: "where" },

    { id: "rule.follow-system", text: "Follow your system", kind: "principle", category: "discipline" },
    { id: "rule.follow-risk", text: "Follow your risk management", kind: "principle", category: "discipline" },
  ],

  // ── PSYCHOLOGY ──────────────────────────────────────────────────────────
  psychology: {
    mantras: [
      "Patience gets me paid",
      "Discipline keeps me in the game",
      "Risk management is the only way",
      "Keep it simple (no need to go higher than the 15m TF)",
      "Focus on base hits",
    ],
    mistakeProtocol: [
      "Understand: it's not too late",
      "Close the trade regardless of whether you're in profit or at a loss",
      "Identify your mistake and document it",
      "Come back tomorrow",
      "Live to trade another day; starting over sucks",
    ],
  },

  // ── LOSING DAY? ─────────────────────────────────────────────────────────
  losingDay: [
    req("losing", "Do not increase DLL"),
    req("losing", "Manually lock out in Tradovate"),
    req("losing", "Close your laptop"),
    req("losing", "Come back tomorrow"),
  ],

  // ── METHODOLOGY ─────────────────────────────────────────────────────────
  methodologies: ["Orderflow", "mSnR", "SMC", "CRT", "LIT", "Inducement", "OptionsFlow"],

  // ── WORKFLOW SETUP ──────────────────────────────────────────────────────
  workflow: [
    {
      id: "workflow.accounts",
      title: "Accounts setup",
      items: [
        req("accounts", "TradingView account"),
        req("accounts", "$2,000 futures demo account (master)"),
        req("accounts", "Copy trader setup"),
      ],
    },
    {
      id: "workflow.office",
      title: "Office setup",
      items: [
        req("office", "Monitor 1: MES, MYM"),
        req("office", "Monitor 2: Google Docs trading plan, execution platform"),
        req("office", "Laptop Tab 1: Tradovate accounts"),
        req("office", "Laptop Tab 2: TradeLocker accounts"),
        req("office", "Laptop Tab 3: prop firm dashboard(s)"),
        req("office", "Laptop Tab 4: ForexFactory"),
      ],
    },
    {
      id: "workflow.laptop",
      title: "Laptop-only setup (Chrome tab group)",
      description: "Use this instead of the office setup when you only have the laptop.",
      items: [
        opt("laptop", "Tab 1 (split view): TradingView & trading plan (NAS100/SPX500)"),
        opt("laptop", "Tab 2 (split view): TradingView (MNQ/MES)"),
        opt("laptop", "Tab 3: execution platform"),
        opt("laptop", "Tab 4: ForexFactory"),
      ],
    },
  ],

  // ── TRADING DAYS & TIMEFRAMES ───────────────────────────────────────────
  tradingDays: [2, 3, 4, 5], // Monday NO · Tuesday–Friday YES
  timeframeRule: "Do not trade below the 15m TF (for analysis; entries are on the 1m per the entry model).",
  timeframes: [
    { id: "M", label: "Monthly", purpose: "Bias, direction" },
    { id: "W", label: "Weekly", purpose: "Bias, direction" },
    { id: "D", label: "Daily", purpose: "Refined HTF zones" },
    { id: "4h", label: "4h", purpose: "Intraday bias" },
    { id: "1h", label: "1h", purpose: "Intraday bias" },
    { id: "30m", label: "30m", purpose: "Intraday bias" },
    { id: "15m", label: "15m", purpose: "Setups, entries, exits" },
  ],

  // ── TRADING PAIRS ───────────────────────────────────────────────────────
  pairs: {
    active: "MES / SPX500",
    reference: ["NAS100", "MNQ", "MYM"],
    rule: "Only trade one pair: SPX500 / MES.",
  },

  // ── INDICATORS ──────────────────────────────────────────────────────────
  indicators: ["ATR", "SMC (LuxAlgo)", "Equal H/L", "Session volume profile"],

  // ── NEWS ────────────────────────────────────────────────────────────────
  news: {
    source: "ForexFactory",
    url: "https://www.forexfactory.com/calendar",
    bufferMinutes: 5,
    rule: "No entries 5 minutes before/after red-folder news.",
  },

  // ── KILLZONES (box & H/L, all ET) ───────────────────────────────────────
  sessions: [
    { id: "asia", name: "Asia", window: { start: "20:00", end: "24:00" }, color: "#8B7CF6" },
    { id: "london", name: "London", window: { start: "02:00", end: "05:00" }, color: "#38BDF8" },
    { id: "frankfurt", name: "Frankfurt", window: null, color: "#2DD4BF" },
    { id: "ny-am", name: "NY AM", window: { start: "09:30", end: "11:00" }, color: "#22C55E" },
    { id: "ny-lunch", name: "NY Lunch", window: { start: "12:00", end: "13:00" }, color: "#F59E0B" },
    { id: "ny-pm", name: "NY PM", window: { start: "13:30", end: "16:00" }, color: "#3B82F6" },
  ],

  // Known gap: the plan's trading window is 9:30–1:30 but the model says the
  // NY killzone 9:30–11:00. Default: 9:30–11:00 green, 11:00–13:30 amber.
  tradingWindows: {
    allowed: { start: "09:30", end: "11:00" },
    extended: { start: "11:00", end: "13:30" },
    noEntryOpen: { start: "09:30", end: "09:40" },
  },
  tradingWindowNote: "Trading window: 9:30 AM – 1:30 PM ET (map on the chart with a horizontal line).",

  // ── CHART PREP (Pre-Session step 5) ─────────────────────────────────────
  chartPrep: [
    req("prep", "Map the pair and the correlated pair"),
    req("prep", "Mark session highs and lows"),
    req("prep", "Draw killzone boxes"),
    req("prep", "Mark volume profile levels (VAH / VAL / POC / HVN / LVN)"),
    req("prep", "Mark major HSnR levels"),
    req("prep", "Draw the trading-window horizontal line"),
  ],

  // ── CHART ANALYSIS (Playbook) ───────────────────────────────────────────
  playbook: [
    {
      id: "pb.methodology",
      title: "Methodology",
      entries: [entry("pb.methodologies", "Methodologies", ["Orderflow", "mSnR", "SMC", "CRT", "LIT", "Inducement", "OptionsFlow"])],
    },
    {
      id: "pb.chart",
      title: "Chart analysis",
      entries: [
        entry("pb.chart-rules", "Rules", [
          "Do not delete present/past drawings",
          "Use the object tree to remove unwanted noise",
          "Map the pair and the correlated pair",
        ]),
        entry("pb.chart-style", "Style", ["Top-down analysis: Monthly → Weekly → 4h → 1h → 30m → 15m"]),
        entry("pb.drawing-tools", "Drawing tools", [
          "During live session: only horizontal rays",
          "Journaling: box, trendlines",
        ]),
        entry("pb.position-tool", "Position sizing tool", [
          "Save TV presets for every account size (account size, risk per trade)",
        ]),
      ],
    },
    {
      id: "pb.poi",
      title: "POI (pro & opposing)",
      entries: [
        entry("pb.poi-msnr", "mSnR", ["Support", "Resistance", "SBR", "RBS", "GAP"]),
        entry("pb.poi-smc", "ICT / SMC", ["Mitigation", "OB", "IFC", "RB", "BB", "IFVG (optional)", "FVG (optional)"]),
      ],
    },
    {
      id: "pb.structure",
      title: "Structure",
      entries: [
        entry("pb.structure-tf", "Timeframes", ["4h", "1h"]),
        entry("pb.structure-bos", "BoS (pro & opposing)", ["Swing", "Major", "Minor", "Micro"]),
        entry("pb.structure-range", "Trading range", ["Swing", "Major", "Minor", "Micro"]),
        entry("pb.structure-pd", "Premium & discount (optional)", ["Major", "Minor", "Micro"]),
      ],
    },
    {
      id: "pb.liquidity",
      title: "Liquidity",
      entries: [
        entry("pb.liq-sessions", "Sessions H/L", [
          "Asia",
          "London",
          "NY AM",
          "NY Lunch",
          "NY PM",
          "Frankfurt",
          "CRT H/L (HTF)",
          "Swing points (HTF)",
        ]),
        entry("pb.liq-pool", "Pool", [
          "Equal H/L",
          "Relatively equal H/L",
          "Weak H/L",
          "Low resistance",
          "0.5 trading range PA",
          "Wick candle",
        ]),
        entry("pb.liq-retail", "Retail", [
          "Trendline",
          "S&R level",
          "Double T/B",
          "Triple T/B",
          "Flag",
          "Triangle",
          "Wedge",
          "Channel",
          "Head and shoulders",
          "Ascending/descending channel",
        ]),
        entry("pb.liq-smc", "SMC", [
          "SMT",
          "Internal liq",
          "External liq",
          "Weak H/L",
          "Old H/L",
          "PDH/PDL",
          "Monthly/Weekly/4h/1h H/L",
          "Imbalance",
          "Volume profile",
          "LVN",
        ]),
      ],
    },
    {
      id: "pb.inducement",
      title: "Inducement",
      entries: [
        entry("pb.inducement-types", "Inducement", [
          "Weak H/L",
          "Old H/L",
          "Internal OB",
          "SMT (fake OB)",
          "Major",
          "Medium",
          "Minor",
          "External",
          "Mitigated OB",
        ]),
        entry("pb.swing-points", "Swing points", ["HTF"]),
      ],
    },
    {
      id: "pb.killzones",
      title: "Killzones (box & H/L, all ET)",
      entries: [
        entry("pb.killzone-times", "Killzones", [
          "NY AM 9:30–11:00",
          "NY Lunch 12:00–13:00",
          "NY PM 13:30–16:00",
          "Asia 20:00–00:00",
          "London 02:00–05:00",
          "Frankfurt (time not set)",
        ]),
      ],
    },
    {
      id: "pb.volume",
      title: "Volume profiles",
      entries: [
        entry("pb.vp", "Volume profiles", [
          "Draw on a separate chart",
          "Map VAH, VAL, HVN, LVN, POC",
          "Types: SVP, CVP, PWVP, CWVP",
        ]),
      ],
    },
    {
      id: "pb.levels",
      title: "Levels & CRT",
      entries: [
        entry("pb.hsnr", "Major horizontal SnR levels", [
          "Horizontal line tool",
          "Use a line chart if needed",
          "Daily, 4h, 1h",
        ]),
        entry("pb.crt", "CRT", ["Monthly", "Weekly", "Daily", "4h"]),
      ],
    },
    {
      id: "pb.tools",
      title: "Indicators & news",
      entries: [
        entry("pb.indicators", "Indicators", ["ATR", "SMC (LuxAlgo)", "Equal H/L", "Session volume profile"]),
        entry("pb.news", "News", ["ForexFactory", "No entries 5 minutes before/after red-folder news"]),
      ],
    },
    {
      id: "pb.strategy",
      title: "Strategy & market conditions",
      entries: [
        entry("pb.strategy-model", "Strategy", ["Continuation model: low risk, high reward"]),
        entry("pb.conditions", "Market conditions", [
          "Ranging",
          "Accumulation (reversal)",
          "Distribution (reversal)",
          "Redistribution (continuation)",
          "Reaccumulation (continuation)",
          "SnD flip",
        ]),
      ],
    },
  ],

  // ── VALIDATE POI ────────────────────────────────────────────────────────
  // Required = the items that also appear in the trading model's "Valid POI"
  // list; the rest raise confidence but are not hard rules. Editable later.
  validatePoi: [
    req("poi", "Pro-trend"),
    opt("poi", "Engulfing"),
    req("poi", "Created during NY/London"),
    req("poi", "Raid", "Did we take significant H/L liquidity?"),
    req("poi", "IFVG/FVG"),
    req("poi", "BoS"),
    opt("poi", "Volume candles"),
    opt("poi", "Fresh and untested?"),
    opt("poi", "Located in OTE"),
    opt("poi", "Mitigates another POI"),
    opt("poi", "Aligned with QM shoulder (optional)"),
    opt("poi", "High volume bars"),
    req("poi", "Aligned with HVN / LVN / VAH / VAL / POC"),
    opt("poi", "VWAP level"),
    opt("poi", "Inducement present/engineered"),
    opt("poi", "Liquidity"),
  ],

  // ── RISK SETTINGS (mirrors Tradovate) ───────────────────────────────────
  riskSettings: [
    {
      id: "risk.loss",
      title: "Loss protection",
      settings: [
        { id: "risk.max-loss-trade", label: "Max loss per trade", value: null, unit: "usd" },
        { id: "risk.dll", label: "Daily loss limit", value: 120, unit: "usd" },
        { id: "risk.wll", label: "Weekly loss limit", value: null, unit: "usd" },
        { id: "risk.dpl", label: "Daily profit limit", value: 200, unit: "usd" },
        { id: "risk.trailing-dd", label: "Trailing max drawdown", value: null, unit: "usd" },
      ],
    },
    {
      id: "risk.profit",
      title: "Profit controls",
      settings: [
        { id: "risk.max-profit-trade", label: "Max profit per trade", value: null, unit: "usd" },
        { id: "risk.daily-profit-trigger", label: "Daily profit trigger", value: null, unit: "usd" },
        { id: "risk.weekly-profit-trigger", label: "Weekly profit trigger", value: null, unit: "usd" },
      ],
    },
    {
      id: "risk.guardrails",
      title: "Trade guardrails",
      settings: [
        { id: "risk.max-time", label: "Max time in trade", value: null, unit: "minutes" },
        { id: "risk.settings-lock", label: "Risk settings lock", value: null, unit: "flag" },
        { id: "risk.lock-if-locked", label: "Lock settings if locked", value: null, unit: "flag" },
      ],
    },
  ],

  // ── ACCOUNTS (RISK, PERSONAL & FUTURES) ─────────────────────────────────
  accounts: [
    {
      id: "futures-50k",
      name: "Futures 50K",
      kind: "futures",
      size: 50_000,
      deposit: null,
      availableDrawdown: 2_000,
      consecutiveLosses: 10,
      // Known gap: $150–$200 (risk section) vs $200 (entry model). Default $200.
      riskPerTrade: 200,
      riskRange: [150, 200],
    },
    {
      id: "futures-25k",
      name: "Futures 25K",
      kind: "futures",
      size: 25_000,
      deposit: null,
      availableDrawdown: null,
      consecutiveLosses: 10,
      riskPerTrade: 100,
      riskRange: null,
    },
    {
      id: "cfd-personal",
      name: "CFD personal",
      kind: "cfd",
      size: 618,
      deposit: 400,
      availableDrawdown: null,
      consecutiveLosses: 19,
      riskPerTrade: 32,
      riskRange: null,
    },
  ],

  instruments: [
    { id: "MES", symbol: "MES", name: "Micro E-mini S&P 500", pointValue: 5, custom: false },
    { id: "ES", symbol: "ES", name: "E-mini S&P 500", pointValue: 50, custom: false },
    { id: "MNQ", symbol: "MNQ", name: "Micro E-mini Nasdaq-100", pointValue: 2, custom: false },
    { id: "NQ", symbol: "NQ", name: "E-mini Nasdaq-100", pointValue: 20, custom: false },
    { id: "MYM", symbol: "MYM", name: "Micro E-mini Dow", pointValue: 0.5, custom: false },
    { id: "SPX500", symbol: "SPX500 CFD", name: "S&P 500 CFD ($ per point you enter)", pointValue: 1, custom: true },
  ],

  riskReminder: "Do not adjust the daily drawdown limit. Do not adjust the SL.",

  // ── STRATEGY & MARKET CONDITION ─────────────────────────────────────────
  strategy: "Continuation model: low risk, high reward.",
  marketConditions: [
    { id: "ranging", label: "Ranging", type: "neutral" },
    { id: "accumulation", label: "Accumulation", type: "reversal" },
    { id: "distribution", label: "Distribution", type: "reversal" },
    { id: "redistribution", label: "Redistribution", type: "continuation" },
    { id: "reaccumulation", label: "Reaccumulation", type: "continuation" },
    { id: "snd-flip", label: "SnD flip", type: "neutral" },
  ],

  // ── BEFORE A TRADE ──────────────────────────────────────────────────────
  beforeTrade: {
    commitments: [
      req("before", "Record live session"),
      req("before", "Accept the potential outcome"),
      req("before", "Be emotionally stable and calm"),
      req("before", "Apply correct risk"),
    ],
    reminders: [
      "Daily lockout = no trading (walk away)",
      "Daily loss limit = no trading (walk away)",
      "Do not adjust the daily drawdown limit",
      "Remember: 3 trade limit per day (1 win / 3 losses / 3 breakeven / 2 losses and 1 win)",
    ],
  },

  // ── TODAY'S PLAN (based on P&L, editable daily) ─────────────────────────
  todaysPlan: {
    pnl: 14,
    riskPerSetupMin: 25,
    riskPerSetupMax: 30,
    lossLimit: 85,
  },

  // 3 trade limit per day. Stop after: 1 win · 3 losses · 3 breakevens · 2 losses + 1 win.
  tradeStops: {
    maxTrades: 3,
    stopAfter: [
      { wins: 1, losses: 0, breakevens: 0 },
      { wins: 0, losses: 3, breakevens: 0 },
      { wins: 0, losses: 0, breakevens: 3 },
      { wins: 1, losses: 2, breakevens: 0 },
    ],
  },

  // ── TRADING MODEL ───────────────────────────────────────────────────────
  tradingModel: {
    time: "NY killzone, 9:30–11:00 AM ET",
    structure: [
      req("structure", "BoS (body close)"),
      req("structure", "Trading range: Major, Minor, Micro"),
    ],
    prerequisites: [req("prereq", "HTF alignment (4H & 15M)")],
    checklist: [
      req("model", "Pair correlation"),
      req("model", "Raid"),
      req("model", "OTE 0.50"),
      req("model", "Valid POI"),
      req("model", "I/FVG"),
      req("model", "Inducement"),
      req("model", "Liquidity"),
      req("model", "DOL"),
      opt("model", "SMT (optional)"),
      req("model", "Volume profile alignment (VAH, VAL, POC, HVN, LVN)"),
    ],
    validPoi: [
      req("validpoi", "BoS (body close)"),
      req("validpoi", "I/FVG"),
      req("validpoi", "Volume profile alignment (HVN, LVN, VAH, VAL, POC)"),
      req("validpoi", "Created in NY/London session"),
      req("validpoi", "Raid"),
      req("validpoi", "Aligned with the 15m trend"),
      req("validpoi", "Based on the 15m TF or higher"),
    ],
  },

  // ── ENTRY MODEL ─────────────────────────────────────────────────────────
  entryModel: {
    timeframe: "1m",
    rules: [
      "No entries during NYSE open (9:30), because of early buyers/sellers liquidity in the first 5–10 minutes after the open",
      "Do not take any POIs right at the NY open",
    ],
    riskPresets: [
      { label: "25K account", amount: 100 },
      { label: "50K account", amount: 200 },
    ],
    prerequisites: [
      req("entryprereq", "Trading model identified"),
      req("entryprereq", "Valid POI"),
      req("entryprereq", "RTPOI / sweep"),
      req("entryprereq", "Entry platform open"),
      req("entryprereq", "Risk predetermined"),
    ],
    types: [
      {
        id: "type1",
        label: "Type 1",
        steps: [req("type1", "RTPOI")],
        forbidden: true,
        warning: "Risk: do not take",
      },
      {
        id: "type2a",
        label: "Type 2(a)",
        steps: [
          req("type2a", "Raid"),
          req("type2a", "Engulfing candle close"),
          req("type2a", "Displacement candle"),
          req("type2a", "FVG inversion (body close)"),
          req("type2a", "Entry = body close"),
        ],
        forbidden: false,
      },
      {
        id: "type2b",
        label: "Type 2(b)",
        steps: [
          req("type2b", "Raid"),
          req("type2b", "Engulfing candle"),
          req("type2b", "Displacement"),
          opt("type2b", "FVG inversion (optional)"),
          req("type2b", "CHoCH (body close)"),
          req("type2b", "Entry = body close"),
        ],
        forbidden: false,
      },
      {
        id: "type3",
        label: "Type 3",
        steps: [
          req("type3", "Raid"),
          req("type3", "CHoCH (body close)"),
          req("type3", "POI created / fresh mSnR zone"),
          req("type3", "Valid POI created"),
          req("type3", "i/FVG"),
          req("type3", "Inducement / liquidity (internal)"),
          req("type3", "Pullback to 0.5 OTE"),
          req("type3", "Entry at RTPOI"),
        ],
        forbidden: false,
      },
    ],
  },

  // ── ENTRY CONFLUENCE ────────────────────────────────────────────────────
  confluences: [
    "VWAP aligned",
    "21 EMA aligned",
    "MTF bias alignment (indicator)",
    "SMT divergence (indicator)",
    "CVD divergence",
    "IRRL",
    "IRL",
    "ERL",
    "HSnR level",
    "TRVP level",
    "QM shoulder",
    "Multi-VP level alignment",
    "CFD vs futures pair divergence",
    "mSnR congestion zone",
    "Retail liquidity",
    "Trendline disrespected",
    "Inducement",
    "Gamma levels",
    "Absorption",
    "Aggression",
    "TPO",
    "Composite value areas",
    "M/W/D VWAP levels",
    "Horizontal SnR level",
  ].map((label) => tag("conf", label)),

  // ── ENTRY TRIGGER (empty in the plan — fill it in later) ────────────────
  entryTrigger: {
    placeholder: "Not set yet. Add your entry trigger steps in Settings.",
    items: [],
  },
};
