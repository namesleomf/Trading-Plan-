import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";
import { EyebrowLabel, PageHeader } from "@/components/ui-kit";

export const metadata: Metadata = { title: "Playbook" };

export default function PlaybookPage() {
  return (
    <>
      <PageHeader
        eyebrow={<EyebrowLabel>Playbook</EyebrowLabel>}
        title="The playbook."
        highlight="How I read the chart."
        subtitle="A searchable reference of your methodology and chart-analysis rules."
      />
      <ComingSoon
        icon={BookOpen}
        phase={5}
        title="Playbook is next"
        features={[
          "Search across everything",
          "Methodologies, POI types, structure, liquidity, inducement",
          "Killzones, volume profiles, CRT, HSnR levels, indicators, news",
          "Notes and optional screenshots on each item",
        ]}
      />
    </>
  );
}
