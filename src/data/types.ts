/**
 * Types for the trading plan.
 *
 * The whole plan is plain data (see plan.ts). Pages never hard-code plan text;
 * they read it from the store, which is seeded from plan.ts. That is what lets
 * Settings edit any rule, number or list later without touching code.
 */

/** "HH:mm" in 24h New York time, e.g. "09:30". "24:00" means midnight at the end of the day. */
export type ClockTime = string;

export interface TimeWindow {
  start: ClockTime;
  end: ClockTime;
}

/** One tickable item. `required` = hard rule; otherwise nice-to-have. */
export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  /** Optional weight used when grading (defaults to 1). */
  weight?: number;
}

export interface ChecklistGroup {
  id: string;
  title: string;
  description?: string;
  items: ChecklistItem[];
}

export type RuleKind = "hard" | "principle";

export type RuleCategoryId =
  | "lockout"
  | "trend"
  | "trade-limits"
  | "time"
  | "where"
  | "discipline";

export interface RuleCategory {
  id: RuleCategoryId;
  title: string;
}

export interface Rule {
  id: string;
  text: string;
  kind: RuleKind;
  category: RuleCategoryId;
}

/** A killzone / trading session, all times in ET. `window: null` = time not set yet. */
export interface Session {
  id: string;
  name: string;
  window: TimeWindow | null;
  /** Hex colour used on the session timeline. */
  color: string;
}

export interface TradingWindows {
  /** Model time: entries allowed (green). */
  allowed: TimeWindow;
  /** Rest of the plan's trading window: amber "Outside model time". */
  extended: TimeWindow;
  /** NYSE open: no entries (early buyers/sellers liquidity). */
  noEntryOpen: TimeWindow;
}

/** 0 = Sunday … 6 = Saturday (New York calendar day). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface TradeStopRules {
  maxTrades: number;
  /** The day ends as soon as any one of these totals is reached. */
  stopAfter: { wins: number; losses: number; breakevens: number }[];
}

export type Bias = "bullish" | "bearish" | "ranging";

export interface Timeframe {
  id: string;
  label: string;
  purpose: string;
}

export type ConditionType = "reversal" | "continuation" | "neutral";

export interface MarketCondition {
  id: string;
  label: string;
  type: ConditionType;
}

export interface EntryType {
  id: "type1" | "type2a" | "type2b" | "type3";
  label: string;
  steps: ChecklistItem[];
  /** Type 1 is never a valid trade. */
  forbidden: boolean;
  warning?: string;
}

export interface Tag {
  id: string;
  label: string;
}

/** A risk setting; `value: null` shows as "Not set". */
export interface RiskSetting {
  id: string;
  label: string;
  value: number | null;
  unit: "usd" | "minutes" | "flag";
}

export interface RiskSettingGroup {
  id: string;
  title: string;
  settings: RiskSetting[];
}

export type AccountKind = "futures" | "cfd";

export interface Account {
  id: string;
  name: string;
  kind: AccountKind;
  size: number;
  /** CFD only. */
  deposit: number | null;
  /** Futures: available drawdown used to size risk. */
  availableDrawdown: number | null;
  /** How many losses in a row the account must survive. */
  consecutiveLosses: number;
  /** Default risk per trade in $ for this account. */
  riskPerTrade: number;
  /** Plan's target range, if it gives one. */
  riskRange: [number, number] | null;
}

export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  /** $ per 1 full point per contract. */
  pointValue: number;
  custom: boolean;
}

export interface Goal {
  id: string;
  label: string;
  target: number;
  current: number;
}

/** One block of reference content in the Playbook. */
export interface PlaybookEntry {
  id: string;
  title: string;
  items: string[];
  note?: string;
  /** Optional screenshot (small data URL), added later from the app. */
  image?: string;
}

export interface PlaybookSection {
  id: string;
  title: string;
  entries: PlaybookEntry[];
}

export interface TodaysPlanDefaults {
  /** Today's drawdown/profit in $ (positive = profit). */
  pnl: number;
  riskPerSetupMin: number;
  riskPerSetupMax: number;
  lossLimit: number;
}

export interface Plan {
  name: string;
  version: string;

  lockout: {
    steps: ChecklistItem[];
    tools: ChecklistItem[];
  };
  goals: Goal[];

  ruleCategories: RuleCategory[];
  rules: Rule[];

  psychology: {
    mantras: string[];
    mistakeProtocol: string[];
  };
  losingDay: ChecklistItem[];

  methodologies: string[];
  workflow: ChecklistGroup[];

  tradingDays: Weekday[];
  timeframeRule: string;
  timeframes: Timeframe[];

  pairs: {
    active: string;
    reference: string[];
    rule: string;
  };

  indicators: string[];

  news: {
    source: string;
    url: string;
    bufferMinutes: number;
    rule: string;
  };

  sessions: Session[];
  tradingWindows: TradingWindows;
  tradingWindowNote: string;

  chartPrep: ChecklistItem[];
  playbook: PlaybookSection[];

  validatePoi: ChecklistItem[];

  riskSettings: RiskSettingGroup[];
  accounts: Account[];
  instruments: Instrument[];
  riskReminder: string;

  strategy: string;
  marketConditions: MarketCondition[];

  beforeTrade: {
    commitments: ChecklistItem[];
    reminders: string[];
  };

  todaysPlan: TodaysPlanDefaults;
  tradeStops: TradeStopRules;

  tradingModel: {
    time: string;
    structure: ChecklistItem[];
    prerequisites: ChecklistItem[];
    checklist: ChecklistItem[];
    validPoi: ChecklistItem[];
  };

  entryModel: {
    timeframe: string;
    rules: string[];
    riskPresets: { label: string; amount: number }[];
    prerequisites: ChecklistItem[];
    types: EntryType[];
  };

  confluences: Tag[];

  entryTrigger: {
    placeholder: string;
    items: ChecklistItem[];
  };
}
