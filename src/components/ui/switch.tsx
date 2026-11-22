"use client";

// shadcn/ui Switch (Radix).
import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-line-strong bg-surface-raised p-0.5 transition-colors",
        "data-[state=checked]:border-primary/40 data-[state=checked]:bg-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="block size-[18px] rounded-full bg-fg shadow-sm transition-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-white"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
