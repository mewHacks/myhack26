"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { BrandMark } from "@/components/brand-mark";
import { AiRecommendationIcon } from "@/components/ui/ai-recommendation-icon";
import NavHeader from "@/components/ui/nav-header";
import {
  headerLinks,
  opportunityTypes,
  type AudienceSlug,
  type BrowseOpportunity,
  type BrowsePageTheme,
} from "@/lib/browse-page-content";

type OpportunityDetailViewProps = {
  audience: AudienceSlug;
  item: BrowseOpportunity;
  theme: BrowsePageTheme;
};

const audienceEntryColor: Record<AudienceSlug, string> = {
  startup: "#4285F4",
  investors: "#34A853",
  mentors: "#FBBC05",
};

const googleRouteColors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

export function OpportunityDetailView({ audience, item, theme }: OpportunityDetailViewProps) {
  const reducedMotion = useReducedMotion();
  const type = opportunityTypes[item.type];
  const entryColor = audienceEntryColor[audience];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-6 sm:px-10 lg:px-12 lg:py-10">
      {!reducedMotion ? (
        <motion.div
          aria-hidden="true"
          animate={{ opacity: [1, 1, 0] }}
          className="pointer-events-none fixed inset-0 z-50 grid grid-cols-4 overflow-hidden bg-white"
          initial={{ opacity: 1 }}
          transition={{ delay: 0.72, duration: 0.32, ease: "easeOut" }}
        >
          {googleRouteColors.map((color, index) => (
            <motion.span
              key={color}
              animate={{ y: index % 2 === 0 ? "-102%" : "102%" }}
              className="h-full w-full"
              initial={{ y: 0 }}
              style={{ backgroundColor: color }}
              transition={{ delay: 0.18 + index * 0.055, duration: 0.66, ease: [0.83, 0, 0.17, 1] }}
            />
          ))}

          <motion.div
            animate={{ opacity: [0, 1, 1, 0], scale: [0.86, 1, 1, 0.92] }}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-foreground shadow-2xl"
            initial={{ opacity: 0, scale: 0.86 }}
            transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
          >
            <AiRecommendationIcon className="h-6 w-6" />
            Opening match
          </motion.div>
        </motion.div>
      ) : null}

      <motion.header
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-line bg-card px-5 py-3"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -18 }}
        transition={{ delay: 0.58, duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href="/" className="text-lg leading-none">
          <BrandMark />
        </Link>

        <div className="flex items-center justify-self-center gap-3">
          <span className="text-lg font-medium text-foreground sm:text-xl">I&apos;m a</span>
          <NavHeader items={headerLinks} />
        </div>

        <Link href="/" className="justify-self-end text-sm font-medium text-muted transition hover:text-foreground">
          Sign in
        </Link>
      </motion.header>

      <motion.section
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        className={`relative overflow-hidden rounded-[1.75rem] border border-line p-4 sm:p-6 ${theme.sectionGradientClass}`}
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94, y: 42 }}
        transition={{ delay: 0.72, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
      >
        {!reducedMotion ? (
          <motion.div
            aria-hidden="true"
            animate={{ opacity: [1, 1, 0], scale: [1, 1.03, 1.09], y: [0, 0, -26] }}
            className="pointer-events-none absolute inset-0 z-30 mix-blend-multiply"
            initial={{ opacity: 1, scale: 1, y: 0 }}
            style={{ backgroundColor: entryColor }}
            transition={{ delay: 0.72, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.article
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, rotateX: 0, rotateY: 0, scale: 1, y: 0 }}
            className={`overflow-hidden rounded-[1.75rem] border border-line bg-card ${theme.headerGlowClass} [transform-style:preserve-3d]`}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, rotateX: -16, rotateY: 10, scale: 0.86, y: 52 }}
            transition={{ delay: 0.86, type: "spring", stiffness: 150, damping: 16, mass: 0.78 }}
          >
            <motion.div
              animate={reducedMotion ? { clipPath: "inset(0% 0% 0% 0% round 1.75rem)" } : { clipPath: "inset(0% 0% 0% 0% round 1.75rem)" }}
              className="relative h-80 sm:h-[32rem]"
              initial={reducedMotion ? { clipPath: "inset(0% 0% 0% 0% round 1.75rem)" } : { clipPath: "inset(12% 12% 12% 12% round 2rem)" }}
              transition={{ delay: 0.94, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src={item.image} alt={item.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </motion.div>
          </motion.article>

          <motion.div
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
            className="relative flex flex-col justify-center overflow-hidden rounded-[1.75rem] border border-line bg-card p-6 sm:p-8"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 42, scale: 0.96 }}
            transition={{ delay: 0.98, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            {!reducedMotion ? (
              <motion.span
                aria-hidden="true"
                animate={{ opacity: [0.95, 0.95, 0], x: ["-120%", "0%", "120%"] }}
                className="pointer-events-none absolute inset-y-0 left-0 w-full"
                initial={{ opacity: 0.95, x: "-120%" }}
                style={{ backgroundColor: entryColor }}
                transition={{ delay: 1.02, duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
              />
            ) : null}

            <motion.div
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              className="relative flex items-center gap-3"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              transition={{ delay: 1.18, duration: 0.34 }}
            >
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${type.badgeClass}`}>
                {type.label}
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{item.meta}</span>
            </motion.div>

            <motion.h1
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              className="relative mt-5 text-4xl font-semibold leading-tight sm:text-5xl"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
              transition={{ delay: 1.26, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.title}
            </motion.h1>
            <motion.p
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              className="relative mt-5 text-base leading-8 text-muted sm:text-lg"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
              transition={{ delay: 1.34, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.summary}
            </motion.p>

            <motion.div
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              className="relative mt-8 flex flex-wrap gap-3"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
              transition={{ delay: 1.42, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/${audience}`}
                className={`inline-flex rounded-full px-5 py-3 text-sm font-semibold transition hover:opacity-90 ${type.buttonClass}`}
              >
                {item.cta}
              </Link>
              <Link href={`/${audience}`} className="inline-flex rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground">
                Back to browse
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
