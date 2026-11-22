import type { Metadata } from "next";
import { Calculator } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";
import { EyebrowLabel, PageHeader } from "@/components/ui-kit";

export const metadata: Metadata = { title: "Risk" };

export default function RiskPage() {
  return (
    <>
      <PageHeader
        eyebrow={<EyebrowLabel>Risk</EyebrowLabel>}
        title="Protect the account."
        highlight="Size every trade."
        subtitle="Your risk settings, account calculators and position sizer."
      />
      <ComingSoon
        icon={Calculator}
        phase={4}
        title="Risk is next"
        features={[
          "Risk settings card (loss protection, profit controls, guardrails)",
          "Personal CFD calculator: account size ÷ 19 losses in a row",
          "Futures calculator: available drawdown ÷ 10 losses in a row",
          "Position sizer for MES, ES, MNQ, NQ, MYM and SPX500 CFD",
        ]}
      />
    </>
  );
}
