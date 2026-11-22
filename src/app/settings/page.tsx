import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";
import { EyebrowLabel, PageHeader } from "@/components/ui-kit";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow={<EyebrowLabel>Settings</EyebrowLabel>}
        title="Settings."
        highlight="Make the plan yours."
        subtitle="Edit any rule, list or number, and keep a backup of your data."
      />
      <ComingSoon
        icon={Settings}
        phase={6}
        title="Settings is next"
        features={[
          "Plan editor: add, remove, reorder, toggle required",
          "Theme, accent colour and active account",
          "Export / import JSON with preview, and reset to default plan",
        ]}
      />
    </>
  );
}
