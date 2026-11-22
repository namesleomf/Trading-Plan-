"use client";

// shadcn/ui Sheet (Radix Dialog sliding in from an edge). Used for the mobile "More" menu.
import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

const sideClasses = {
  bottom: "inset-x-3 bottom-3 rounded-[28px] max-h-[85dvh]",
  right: "inset-y-3 right-3 w-[min(24rem,calc(100%-1.5rem))] rounded-[28px]",
  left: "inset-y-3 left-3 w-[min(24rem,calc(100%-1.5rem))] rounded-[28px]",
} as const;

function SheetContent({
  className,
  children,
  side = "bottom",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & { side?: keyof typeof sideClasses }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "glass fixed z-50 flex flex-col gap-4 overflow-y-auto border border-line-strong p-5 shadow-card",
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-fg-3 transition-colors hover:bg-surface-raised hover:text-fg">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title className={cn("text-base font-semibold", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description className={cn("text-sm text-fg-2", className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };
