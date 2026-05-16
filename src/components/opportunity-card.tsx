"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

import { AiRecommendationIcon } from "@/components/ui/ai-recommendation-icon";
import { opportunityTypes, type BrowseOpportunity } from "@/lib/browse-page-content";

type OpportunityCardProps = {
  href: string;
  item: BrowseOpportunity;
  glowClass: string;
  index: number;
  recommended?: boolean;
};

type TooltipState = {
  x: number;
  y: number;
  visible: boolean;
  skew: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const googleEntryColors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

export function OpportunityCard({ href, item, glowClass, index, recommended = false }: OpportunityCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const lastXRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const type = opportunityTypes[item.type];
  const entryColor = googleEntryColors[index % googleEntryColors.length];
  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0,
    y: 0,
    visible: false,
    skew: 0,
  });

  return (
    <motion.div
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      className="[perspective:1200px]"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.96, rotateX: -6 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              delay: index * 0.075,
              type: "spring",
              stiffness: 140,
              damping: 18,
              mass: 0.72,
            }
      }
    >
      <Link
        ref={cardRef}
        href={href}
        className={`group relative block overflow-hidden rounded-[1.75rem] border border-line bg-card ${glowClass} ${
          recommended ? "ring-1 ring-white/70" : ""
        } transition hover:-translate-y-1 hover:shadow-lg`}
        onBlur={() => setTooltip((current) => ({ ...current, visible: false }))}
        onFocus={() => setTooltip({ x: 24, y: 104, visible: true, skew: 0 })}
        onPointerLeave={() => setTooltip((current) => ({ ...current, visible: false, skew: 0 }))}
        onPointerMove={(event) => {
          const rect = cardRef.current?.getBoundingClientRect();
          if (!rect) return;

          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const velocityX = x - lastXRef.current;
          lastXRef.current = x;
          const maxX = Math.max(16, rect.width - 288);
          const maxY = Math.max(16, rect.height - 128);

          setTooltip({
            x: clamp(x - 144, 16, maxX),
            y: clamp(y - 64, 16, maxY),
            visible: true,
            skew: clamp(velocityX * 0.18, -8, 8),
          });
        }}
      >
        {!reducedMotion ? (
          <>
            <motion.span
              aria-hidden="true"
              animate={{ opacity: [0.96, 0.92, 0], scale: [1, 1.02, 1.08] }}
              className="pointer-events-none absolute inset-0 z-30"
              initial={{ opacity: 0.96, scale: 1 }}
              style={{ backgroundColor: entryColor }}
              transition={{ delay: index * 0.075 + 0.08, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              aria-hidden="true"
              animate={{ opacity: [0, 0.9, 0], scaleX: [0, 1, 1] }}
              className="pointer-events-none absolute inset-x-6 top-5 z-40 h-1 rounded-full bg-white"
              initial={{ opacity: 0, scaleX: 0 }}
              transition={{ delay: index * 0.075 + 0.16, duration: 0.36, ease: "easeOut" }}
            />
            <motion.span
              aria-hidden="true"
              animate={{ opacity: [0, 0.5, 0], scale: [0.92, 1, 1.04] }}
              className="pointer-events-none absolute inset-0 z-40 rounded-[1.75rem] border-2 border-white"
              initial={{ opacity: 0, scale: 0.92 }}
              transition={{ delay: index * 0.075 + 0.16, duration: 0.42, ease: "easeOut" }}
            />
          </>
        ) : null}

        <div className={`relative ${recommended ? "h-72 sm:h-80" : "h-64 sm:h-72"}`}>
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            {recommended ? (
              <span className="inline-flex items-center gap-2.5 rounded-full bg-white/92 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground backdrop-blur-sm">
                <AiRecommendationIcon className="h-5 w-5 shrink-0" />
                AI Pick
              </span>
            ) : (
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${type.badgeClass}`}>
                {type.label}
              </span>
            )}

            {recommended ? (
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${type.badgeClass}`}>
                {type.label}
              </span>
            ) : (
              <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur-sm">
                {item.meta}
              </span>
            )}
          </div>

          <motion.div
            aria-hidden="true"
            animate={{
              opacity: tooltip.visible ? 1 : 0,
              scale: tooltip.visible ? 1 : 0.96,
              skewX: tooltip.skew,
              x: tooltip.x,
              y: tooltip.y,
            }}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden w-80 rounded-2xl border border-white/70 bg-white/95 p-4 text-foreground shadow-xl backdrop-blur-md sm:block"
            initial={false}
            transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.7 }}
          >
            {item.summary}
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-5 text-white sm:p-6">
            {recommended ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/80">{item.meta}</span>
                <span className="text-sm font-semibold text-white">Open</span>
              </div>
            ) : null}

            <h2 className={`${recommended ? "mt-3" : ""} text-2xl font-semibold leading-tight`}>{item.title}</h2>
            <span className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${type.buttonClass}`}>
              {item.cta}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
