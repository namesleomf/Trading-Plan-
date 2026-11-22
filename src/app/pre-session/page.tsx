import type { Metadata } from "next";
import { Sunrise } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";
import { EyebrowLabel, PageHeader } from "@/components/ui-kit";

export const metadata: Metadata = { title: "Pre-Session" };

export default function PreSessionPage() {
  return (
    <>
      <PageHeader
        eyebrow={<EyebrowLabel>Pre-session</EyebrowLabel>}
        title="Before the bell."
        highlight="Set up, then sit tight."
        subtitle="A step-by-step flow to tick through before 9:30 ET. Resets every new trading day."
      />
      <ComingSoon
        icon={Sunrise}
        phase={5}
        title="Pre-Session is next"
        features={[
          "Workflow setup and lockout tools check",
          "Top-down analysis, Monthly → 15m, with a bias for each timeframe",
          "Market condition picker (reversal vs continuation)",
          "Chart prep checklist and before-a-trade commitments",
        ]}
      />
    </>
  );
}
