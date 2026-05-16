"use client";

import { useState } from "react";

import { FeedbackWidget } from "@/components/feedback-widget";
import { allProfiles } from "@/lib/profiles";
import type { Relationship } from "@/lib/store";

type RelationshipCardProps = {
  relationship: Relationship;
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

export function RelationshipCard({ relationship: rel, viewerId }: RelationshipCardProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const otherActorId = rel.viewerId === viewerId ? rel.matchedId : rel.viewerId;
  const matchedProfile = allProfiles.find((p) => p.id === otherActorId);
  const side = rel.viewerId === viewerId ? "viewer" : "matched";
  const myFeedback = side === "viewer" ? rel.feedbackFromViewer : rel.feedbackFromMatched;
  const theirFeedback = side === "viewer" ? rel.feedbackFromMatched : rel.feedbackFromViewer;
  const canRate = !myFeedback && rel.status !== "completed";

  return (
    <div className="space-y-3 rounded-[1.75rem] border border-line bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-foreground">{matchedProfile?.name ?? rel.matchedId}</p>
          <p className="mt-0.5 text-sm text-muted">{rel.rationale}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusColors[rel.status]}`}>
          {statusLabel[rel.status]}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span>Match score <strong className="text-foreground">{rel.matchScore}/100</strong></span>
        <span>Sessions <strong className="text-foreground">{rel.sessionCount}</strong></span>
        {myFeedback && (
          <span>Your rating <strong className="text-foreground">{myFeedback.rating}/5</strong></span>
        )}
        {theirFeedback && (
          <span>Their rating <strong className="text-foreground">{theirFeedback.rating}/5</strong></span>
        )}
      </div>

      {canRate && (
        showFeedback ? (
          <FeedbackWidget
            relationshipId={rel.id}
            side={side}
            onSubmitted={() => setShowFeedback(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowFeedback(true)}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium text-foreground transition hover:bg-black/4"
          >
            Rate this session
          </button>
        )
      )}
    </div>
  );
}
