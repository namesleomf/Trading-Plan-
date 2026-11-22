import {
  BookOpen,
  Brain,
  Calculator,
  Gauge,
  Scale,
  Settings,
  ShieldCheck,
  Sunrise,
  Target,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  /** Shorter label for the mobile bar. */
  short: string;
  icon: LucideIcon;
  /** Keyboard shortcut (1–9). */
  key: string;
}

/** The 9 sections, in order. Used by the sidebar, mobile nav and keyboard shortcuts. */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Today", short: "Today", icon: Gauge, key: "1" },
  { href: "/pre-session", label: "Pre-Session", short: "Pre", icon: Sunrise, key: "2" },
  { href: "/checklist", label: "Trade Checklist", short: "Checklist", icon: ShieldCheck, key: "3" },
  { href: "/risk", label: "Risk", short: "Risk", icon: Calculator, key: "4" },
  { href: "/rules", label: "Rules", short: "Rules", icon: Scale, key: "5" },
  { href: "/playbook", label: "Playbook", short: "Playbook", icon: BookOpen, key: "6" },
  { href: "/mindset", label: "Mindset", short: "Mindset", icon: Brain, key: "7" },
  { href: "/goals", label: "Goals & Lockouts", short: "Goals", icon: Target, key: "8" },
  { href: "/settings", label: "Settings", short: "Settings", icon: Settings, key: "9" },
];

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
