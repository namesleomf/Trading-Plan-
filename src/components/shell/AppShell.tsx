import type { ReactNode } from "react";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

/** Sidebar (desktop) + glass top bar + page content + floating bottom nav (mobile). */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="transition-[padding] duration-200 ease-out lg:pl-64 sidebar-collapsed:lg:pl-[76px]">
        <TopBar />
        <main id="main" className="mx-auto w-full max-w-[1280px] px-4 pb-32 md:px-8 lg:pb-16">
          {children}
        </main>
      </div>
      <MobileNav />
      <KeyboardShortcuts />
    </>
  );
}
