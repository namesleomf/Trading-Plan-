"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { cn, formatNumber, type NumberFormat } from "@/lib/utils";

/** A number that counts up/down smoothly when it changes (instantly under reduced motion). */
export function AnimatedNumber({
  value,
  format = "int",
  className,
}: {
  value: number;
  format?: NumberFormat;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(value);
  const text = useTransform(motionValue, (v) => formatNumber(v, format));

  useEffect(() => {
    if (reduce) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration: 0.6, ease: "easeOut" });
    return () => controls.stop();
  }, [value, reduce, motionValue]);

  return <motion.span className={cn("num", className)}>{text}</motion.span>;
}
