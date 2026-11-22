import type { Metadata, Viewport } from "next";
import "@fontsource-variable/dm-sans";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";
import { Providers } from "@/components/shell/Providers";
import { STORAGE_KEY } from "@/store/storageKey";

export const metadata: Metadata = {
  title: { default: "Plan", template: "%s · Plan" },
  description: "My trading plan, made interactive.",
};

export const viewport: Viewport = {
  themeColor: "#05070d",
  colorScheme: "dark light",
};

/**
 * Runs before the first paint: reads the saved theme + sidebar state from
 * localStorage and puts them on <html>, so a refresh never flashes the wrong theme.
 */
const prePaintScript = `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)})||"null");var st=s&&s.state&&s.state.settings;var r=document.documentElement;if(st){if(st.theme==="light"||st.theme==="dark")r.setAttribute("data-theme",st.theme);r.setAttribute("data-sidebar",st.sidebarCollapsed?"collapsed":"expanded");}}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" data-sidebar="expanded" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaintScript }} />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
