import { EyebrowPill, PageHeader } from "@/components/ui-kit";
import { TodayPreview } from "@/components/today/TodayPreview";

export default function TodayPage() {
  return (
    <>
      <PageHeader
        eyebrow={<EyebrowPill label="Latest" meta="Plan v2026" arrow href="/rules" />}
        title="Today."
        highlight="Your command centre."
        subtitle="Can I trade right now, and how? Everything you need before and during the New York session."
      />
      <TodayPreview />
    </>
  );
}
