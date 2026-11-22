import type { Metadata } from "next";
import { Scale } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";
import { EyebrowLabel, PageHeader } from "@/components/ui-kit";

export const metadata: Metadata = { title: "Rules" };

export default function RulesPage() {
  return (
    <>
      <PageHeader
        eyebrow={<EyebrowLabel>Rules</EyebrowLabel>}
        title="My rules."
        highlight="Non-negotiable."
        subtitle="Hard rules and principles, grouped so they're quick to re-read."
      />
      <ComingSoon
        icon={Scale}
        phase={5}
        title="Rules is next"
        features={[
          "Lockout & limits, trend & bias, trade limits, time & session",
          "Where I never trade, and discipline",
          "Hard rules marked in red, principles in neutral",
          "Optional daily “I've read my rules” acknowledgement",
        ]}
      />
    </>
  );
}
