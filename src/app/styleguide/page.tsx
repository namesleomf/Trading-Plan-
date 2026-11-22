import type { Metadata } from "next";
import { StyleguideView } from "@/components/styleguide/StyleguideView";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

/** Hidden page (not in the nav) showing every design-system component. */
export default function StyleguidePage() {
  return <StyleguideView />;
}
