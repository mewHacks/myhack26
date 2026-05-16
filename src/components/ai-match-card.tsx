"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

import { AiRecommendationIcon } from "@/components/ui/ai-recommendation-icon";
import { RationaleCard } from "@/components/rationale-card";
import type { MatchResult } from "@/lib/match-engine";
import type { ActorProfile } from "@/lib/profiles";
import { allProfiles } from "@/lib/profiles";

type AiMatchCardProps = {
  match: MatchResult;
  index: number;
  glowClass: string;
  viewerId: string;
};

const typeLabel: Record<string, string> = {
  mentor: "Mentor",
  investor: "Investor",
  founder: "Founder",
};

const typeBadge: Record<string, string> = {
  mentor: "bg-[var(--color-google-yellow-soft)] text-[#8a6500]",
  investor: "bg-[var(--color-google-green-soft)] text-[var(--color-google-green)]",
  founder: "bg-[var(--color-google-blue-soft)] text-[var(--color-google-blue)]",
};

const googleEntryColors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

function profileMeta(profile: ActorProfile): string {
  if (profile.type === "mentor") {
    return `${profile.expertise.slice(0, 2).join("  •  ")}  •  ${profile.geography}`;
  }
  if (profile.type === "investor") {
    return `${profile.check_size}  •  ${profile.stage.join(", ")}`;
  }
  return `${profile.sector.slice(0, 2).join("  •  ")}  •  ${profile.stage}`;
}

export function AiMatchCard({ match, index, glowClass, viewerId }: AiMatchCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const lastXRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const profile = allProfiles.find((p) => p.id === match.id);
  if (!profile) return null;

  const entryColor = googleEntryColors[index % googleEntryColors.length];

  async function handleConnect() {
    setConnecting(true);
    const response = await fetch("/api/relationships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        viewerId,
        matchedId: match.id,
        matchScore: match.score,
        rationale: match.rationale,
        breakdown: match.breakdown,
      }),
    });
    if (!response.ok) {
      setConnecting(false);
      return;
    }
    setConnecting(false);
    setConnected(true);
  }

  return (
    <motion.div
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      className="[perspective:1200px]"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.96 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { delay: index * 0.075, type: "spring", stiffness: 140, damping: 18, mass: 0.72 }
      }
    >
      <div
        ref={cardRef}
        className={`group relative block overflow-hidden rounded-[1.75rem] border border-line bg-card ${glowClass} ring-1 ring-white/70 transition hover:-translate-y-1 hover:shadow-lg`}
        onPointerLeave={() => setTooltipVisible(false)}
        onPointerMove={(e) => {
          const rect = cardRef.current?.getBoundingClientRect();
          if (!rect) return;
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          lastXRef.current = x;
          setTooltipPos({ x: Math.min(x + 18, rect.width - 296), y: Math.min(y - 12, rect.height - 260) });
          setTooltipVisible(true);
        }}
      >
        {!reducedMotion && (
          <>
            <motion.span
              aria-hidden="true"
              animate={{ opacity: [0.96, 0.92, 0], scale: [1, 1.02, 1.08] }}
              className="pointer-events-none absolute inset-0 z-30"
              initial={{ opacity: 0.96, scale: 1 }}
              style={{ backgroundColor: entryColor }}
              transition={{ delay: index * 0.075 + 0.08, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            />
          </>
        )}

        <div className="relative h-72 sm:h-80">
          <Image
            src={profile.image}
            alt={profile.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <span className="inline-flex items-center gap-2.5 rounded-full bg-white/92 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground backdrop-blur-sm">
              <AiRecommendationIcon className="h-5 w-5 shrink-0" />
              AI Pick
            </span>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${typeBadge[profile.type] ?? ""}`}>
              {typeLabel[profile.type]}
            </span>
          </div>

          <motion.div
            aria-hidden="true"
            animate={{ opacity: tooltipVisible ? 1 : 0, scale: tooltipVisible ? 1 : 0.96 }}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden sm:block"
            initial={false}
            style={{ x: tooltipPos.x, y: tooltipPos.y }}
            transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.7 }}
          >
            <RationaleCard match={match} />
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-5 text-white sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/80">
                {profileMeta(profile)}
              </span>
              <span className="text-sm font-bold tabular-nums text-white">
                {match.score}<span className="text-xs font-normal text-white/70">/100</span>
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold leading-tight">{profile.name}</h2>
            <button
              type="button"
              onClick={handleConnect}
              disabled={connected || connecting}
              className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
                connected
                  ? "bg-[var(--color-google-green)] text-white"
                  : "bg-white text-foreground hover:bg-white/90"
              }`}
            >
              {connected
                ? "✓ Connected"
                : connecting
                ? "Connecting…"
                : profile.type === "mentor"
                ? "Book mentor"
                : profile.type === "investor"
                ? "Request intro"
                : "View profile"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
