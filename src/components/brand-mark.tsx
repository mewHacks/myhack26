"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  const gradientStops = [
    "linear-gradient(90deg, var(--color-google-blue), var(--color-google-red), var(--color-google-yellow), var(--color-google-blue))",
    "linear-gradient(90deg, var(--color-google-yellow), var(--color-google-blue), var(--color-google-red), var(--color-google-yellow))",
  ];

  return (
    <motion.span
      className={cn(
        "inline-flex items-center gap-[0.02em] bg-clip-text font-semibold tracking-tight text-transparent",
        className,
      )}
      animate={{
        backgroundImage: gradientStops,
        backgroundPosition: ["0% 50%", "100% 50%"],
      }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "linear",
      }}
      style={{ backgroundSize: "200% 100%" }}
    >
      Covalent
    </motion.span>
  );
}
