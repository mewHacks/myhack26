"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { FeedbackWidget } from "@/components/feedback-widget";
import { ProfileStrengthBadge } from "@/components/profile-strength-badge";
import { allProfiles } from "@/lib/profiles";
import type { StrengthScore } from "@/lib/strength-calculator";
import type { Relationship } from "@/lib/store";

type RelationshipDashboardProps = {
  viewerId: string;
};

const statusColors: Record<Relationship["status"], string> = {
  pending: "bg-[var(--color-google-blue-soft)] text-[var(--color-google-blue)]",
  active: "bg-[var(--color-google-yellow-soft)] text-[#8a6500]",
  completed: "bg-[var(--color-google-green-soft)] text-[var(--color-google-green)]",
};

const statusLabel: Record<Relationship["status"], string> = {
  pending: "Pending",
  active: "Active",
  completed: "Completed",
};

const branchColors = [
  "bg-[var(--color-google-blue)]",
  "bg-[var(--color-google-red)]",
  "bg-[var(--color-google-yellow)]",
  "bg-[var(--color-google-green)]",
];

const branchHexColors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

const relationshipTypeLabel: Record<Relationship["type"], string> = {
  "mentor:founder": "Mentor match",
  "investor:founder": "Investor lead",
  "mentor:investor": "Network bridge",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function RootAvatar({ name, image, imageAlt }: { name: string; image?: string; imageAlt?: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-[var(--color-google-blue)]/20 sm:h-24 sm:w-24">
        {image ? (
          <Image src={image} alt={imageAlt ?? ""} fill sizes="96px" className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-white text-xl font-bold text-foreground">
            {initials(name)}
          </span>
        )}
      </span>
      <span className="mt-2 text-sm font-semibold text-foreground">{name}</span>
    </div>
  );
}

function ConnectionNode({
  rel,
  viewerId,
  index,
}: {
  rel: Relationship;
  viewerId: string;
  index: number;
}) {
  const [showFeedback, setShowFeedback] = useState(false);
  const reducedMotion = useReducedMotion();
  const otherActorId = rel.viewerId === viewerId ? rel.matchedId : rel.viewerId;
  const profile = allProfiles.find((p) => p.id === otherActorId);
  const side = rel.viewerId === viewerId ? "viewer" : "matched";
  const myFeedback = side === "viewer" ? rel.feedbackFromViewer : rel.feedbackFromMatched;
  const theirFeedback = side === "viewer" ? rel.feedbackFromMatched : rel.feedbackFromViewer;
  const canRate = !myFeedback && rel.status !== "completed";
  const breakdown = rel.breakdown ? Object.entries(rel.breakdown) : [];

  return (
    <motion.div
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      className="flex items-start gap-4"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 28 }}
      transition={reducedMotion ? { duration: 0 } : { delay: 0.18 + index * 0.08, type: "spring", stiffness: 150, damping: 20 }}
    >
      <div className="flex flex-col items-center pt-1">
        <motion.span
          animate={reducedMotion ? { scale: 1 } : { scale: [1, 1.35, 1] }}
          className={`h-3 w-3 rounded-full ${branchColors[index % branchColors.length]}`}
          transition={reducedMotion ? { duration: 0 } : { delay: 0.45 + index * 0.08, duration: 0.55 }}
        />
        <span className="min-h-[1rem] w-px flex-1 bg-line" />
      </div>
      <motion.div
        className="group relative min-w-0 flex-1 overflow-hidden rounded-[1.5rem] border border-line bg-card p-4 shadow-[0_12px_34px_rgba(60,64,67,0.06)] sm:p-5"
        whileHover={reducedMotion ? undefined : { y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-80"
          style={{ backgroundColor: branchHexColors[index % branchHexColors.length] }}
        />
        <div className="flex items-center gap-3">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-line">
            {profile?.image ? (
              <Image src={profile.image} alt={profile.imageAlt ?? ""} fill sizes="40px" className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-white text-xs font-bold text-foreground">
                {initials(profile?.name ?? otherActorId)}
              </span>
            )}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-foreground">
                {profile?.name ?? otherActorId}
              </p>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[rel.status]}`}
              >
                {statusLabel[rel.status]}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              {relationshipTypeLabel[rel.type]}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted">{rel.rationale}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[0.8fr_1fr]">
          <div className="rounded-2xl bg-black/[0.03] p-3">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Match score</span>
              <strong className="text-foreground">{rel.matchScore}/100</strong>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
              <motion.div
                animate={{ width: `${rel.matchScore}%` }}
                className="h-full rounded-full"
                initial={{ width: 0 }}
                style={{ backgroundColor: branchHexColors[index % branchHexColors.length] }}
                transition={reducedMotion ? { duration: 0 } : { delay: 0.35 + index * 0.08, duration: 0.7, ease: "easeOut" }}
              />
            </div>
          </div>
          <div className="flex flex-wrap content-center gap-x-4 gap-y-1 rounded-2xl bg-black/[0.03] p-3 text-xs text-muted">
          <span>
            Sessions <strong className="text-foreground">{rel.sessionCount}</strong>
          </span>
          {myFeedback && (
            <span>
              You <strong className="text-foreground">{myFeedback.rating}/5</strong>
            </span>
          )}
          {theirFeedback && (
            <span>
              Them <strong className="text-foreground">{theirFeedback.rating}/5</strong>
            </span>
          )}
          </div>
        </div>

        {breakdown.length > 0 ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {breakdown.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-line/70 px-3 py-2">
                <div className="flex items-center justify-between gap-3 text-[11px] text-muted">
                  <span className="capitalize">{label.replaceAll("_", " ")}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-black/10">
                  <motion.div
                    animate={{ width: `${Math.min(100, value * 3.4)}%` }}
                    className="h-full rounded-full bg-foreground"
                    initial={{ width: 0 }}
                    transition={reducedMotion ? { duration: 0 } : { delay: 0.45 + index * 0.08, duration: 0.62 }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {canRate &&
          (showFeedback ? (
            <div className="mt-3">
              <FeedbackWidget
                relationshipId={rel.id}
                actorId={viewerId}
                onSubmitted={() => setShowFeedback(false)}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowFeedback(true)}
              className="mt-3 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-black/4"
            >
              Rate this session
            </button>
          ))}
      </motion.div>
    </motion.div>
  );
}

function StatCard({ label, value, detail, color, index }: { label: string; value: string; detail: string; color: string; index: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_52px_rgba(60,64,67,0.08)] backdrop-blur-sm"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
      transition={reducedMotion ? { duration: 0 } : { delay: index * 0.08, type: "spring", stiffness: 150, damping: 18 }}
    >
      <span aria-hidden="true" className="absolute right-4 top-4 h-10 w-10 rounded-full opacity-18" style={{ backgroundColor: color }} />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-4 text-3xl font-semibold tabular-nums text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </motion.div>
  );
}

export function RelationshipDashboard({ viewerId }: RelationshipDashboardProps) {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [strength, setStrength] = useState<StrengthScore | null>(null);
  const [loading, setLoading] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch(`/api/relationships?viewerId=${viewerId}`).then((r) => r.json()),
      fetch(`/api/profile-strength/${viewerId}`).then((r) => r.json()),
    ]).then(([relData, strengthData]) => {
      if (cancelled) return;
      setRelationships(relData.relationships ?? []);
      setStrength(strengthData.strength ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [viewerId]);

  if (loading) {
    return (
      <div className="relative space-y-4">
        <div className="h-56 animate-pulse rounded-[1.75rem] border border-white/70 bg-white/70" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-[1.75rem] border border-line bg-card" />
        ))}
      </div>
    );
  }

  const viewerProfile = allProfiles.find((p) => p.id === viewerId);
  const totalSessions = relationships.reduce((sum, rel) => sum + rel.sessionCount, 0);
  const averageScore = relationships.length
    ? Math.round(relationships.reduce((sum, rel) => sum + rel.matchScore, 0) / relationships.length)
    : 0;
  const completedCount = relationships.filter((rel) => rel.status === "completed").length;
  const viewerOrganization =
    viewerProfile?.type === "founder"
      ? viewerProfile.company
      : viewerProfile?.type === "investor"
        ? viewerProfile.fund
        : "Covalent network";

  return (
    <div className="relative space-y-6">
      <motion.div
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
        transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 130, damping: 18 }}
      >
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_70px_rgba(60,64,67,0.08)] backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Your activity</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
                Connection Dashboard
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                Track mentor sessions, investor follow-ups, feedback loops, and profile strength from one living relationship map.
              </p>
            </div>

            <div className="shrink-0 rounded-[1.5rem] border border-line bg-white p-4 shadow-[0_14px_38px_rgba(60,64,67,0.08)]">
              <RootAvatar name={viewerProfile?.name ?? viewerId} image={viewerProfile?.image} imageAlt={viewerProfile?.imageAlt} />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <span className="rounded-2xl border border-line bg-[var(--color-google-blue-soft)]/60 px-4 py-3 text-sm font-semibold text-[var(--color-google-blue)]">
              {viewerProfile?.type ?? "Founder"}
            </span>
            <span className="rounded-2xl border border-line bg-[var(--color-google-green-soft)]/70 px-4 py-3 text-sm font-semibold text-[var(--color-google-green)]">
              {viewerOrganization}
            </span>
            <span className="rounded-2xl border border-line bg-[var(--color-google-yellow-soft)]/80 px-4 py-3 text-sm font-semibold text-[#8a6500]">
              {relationships.length} live relationships
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <StatCard label="Avg match" value={`${averageScore}%`} detail="Quality across active and completed relationships." color="#4285F4" index={0} />
          <StatCard label="Sessions" value={`${totalSessions}`} detail="Logged touchpoints across the network graph." color="#FBBC05" index={1} />
          <StatCard label="Completed" value={`${completedCount}`} detail="Relationships with both feedback loops closed." color="#34A853" index={2} />
        </div>
      </motion.div>

      {strength ? (
        <motion.div
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/70 bg-card/90 p-6 shadow-[0_16px_50px_rgba(60,64,67,0.07)] backdrop-blur-sm"
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
          transition={reducedMotion ? { duration: 0 } : { delay: 0.12, type: "spring", stiffness: 150, damping: 20 }}
        >
          <ProfileStrengthBadge strength={strength} size="lg" />
        </motion.div>
      ) : null}

      <div>
        <div className="mb-4 flex flex-col gap-2 px-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Your connections</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">Relationship graph</h2>
          </div>
          <p className="text-sm text-muted">{relationships.length} nodes scored by AI fit and feedback.</p>
        </div>

        {relationships.length === 0 ? (
          <p className="text-sm text-muted">
            No connections yet. Connect with an AI match to get started.
          </p>
        ) : (
          <motion.div
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_12px_36px_rgba(60,64,67,0.06)] backdrop-blur-sm sm:p-6"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
            transition={reducedMotion ? { duration: 0 } : { delay: 0.18, type: "spring", stiffness: 145, damping: 20 }}
          >
            <div className="flex flex-col items-center gap-1">
              <RootAvatar
                name={viewerProfile?.name ?? viewerId}
                image={viewerProfile?.image}
                imageAlt={viewerProfile?.imageAlt}
              />

              <div className="mt-3 mb-4 flex flex-col items-center">
                <span className="h-4 w-px bg-line" />
                <span className="mt-1 h-3 w-3 rounded-full bg-[var(--color-google-blue)]/40" />
              </div>

              <div className="w-full max-w-lg space-y-3">
                {relationships.map((rel, i) => (
                  <ConnectionNode key={rel.id} rel={rel} viewerId={viewerId} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
