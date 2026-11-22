import type { Metadata } from "next";
import { Target } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";
import { EyebrowLabel, PageHeader } from "@/components/ui-kit";

export const metadata: Metadata = { title: "Goals & Lockouts" };

export default function GoalsPage() {
  return (
    <>
      <PageHeader
        eyebrow={<EyebrowLabel>Goals & lockouts</EyebrowLabel>}
        title="Goals & lockouts."
        highlight="Build the account."
        subtitle="Track funding and payouts, and keep your weekly lockout routine."
      />
      <ComingSoon
        icon={Target}
        phase={5}
        title="Goals & Lockouts is next"
        features={[
          "Get 100K in funding · Receive 10K in payouts",
          "Lockout setup steps with a “last done” date",
          "Reminder: never trade the funded account on the day you pass",
        ]}
      />
    </>
  );
}
