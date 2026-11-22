import type { Metadata } from "next";
import { Brain } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";
import { EyebrowLabel, PageHeader } from "@/components/ui-kit";

export const metadata: Metadata = { title: "Mindset" };

export default function MindsetPage() {
  return (
    <>
      <PageHeader
        eyebrow={<EyebrowLabel>Mindset</EyebrowLabel>}
        title="Patience"
        highlight="gets me paid."
        subtitle="Your psychology lines, the mistake protocol and the losing-day lockout."
      />
      <ComingSoon
        icon={Brain}
        phase={5}
        title="Mindset is next"
        features={[
          "Psychology lines as large quote cards",
          "“If I make a mistake” protocol, with a dated note",
          "Losing-day lockout flow: no unlock button until tomorrow",
        ]}
      />
    </>
  );
}
