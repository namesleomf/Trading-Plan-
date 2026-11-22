import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";
import { EyebrowLabel, PageHeader } from "@/components/ui-kit";

export const metadata: Metadata = { title: "Trade Checklist" };

export default function ChecklistPage() {
  return (
    <>
      <PageHeader
        eyebrow={<EyebrowLabel>Trade checklist</EyebrowLabel>}
        title="Every entry"
        highlight="earns its place."
        subtitle="Run this before every entry. Any missing required item means No Trade."
      />
      <ComingSoon
        icon={ShieldCheck}
        phase={3}
        title="Trade Checklist is next"
        features={[
          "Automatic gate checks: day, window, NYSE open, news, trade limit, lockout",
          "Trading model, Validate POI and entry model Type 1 / 2(a) / 2(b) / 3",
          "Entry confluence chips and risk from the active account",
          "Live verdict with a grade: A+ / A / B / No Trade",
        ]}
      />
    </>
  );
}
