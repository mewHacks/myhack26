import { NextRequest, NextResponse } from "next/server";

import { getMatches } from "@/lib/match-engine";
import { findProfile, getCandidatesFor } from "@/lib/profiles";
import { getRelationshipsForActor, type Relationship } from "@/lib/store";
import { computeWeightOverrides } from "@/lib/weight-engine";

export async function POST(req: NextRequest) {
  const { viewerId } = await req.json();

  if (!viewerId) {
    return NextResponse.json({ error: "viewerId required" }, { status: 400 });
  }

  const viewer = findProfile(viewerId);
  if (!viewer) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const candidates = getCandidatesFor(viewer);
  const relationships = getRelationshipsForActor(viewerId);
  const weights = computeWeightOverrides(viewerId, relationships);

  const completedWithFeedback = relationships.filter(
    (r) => r.status === "completed" && (r.feedbackFromViewer || r.feedbackFromMatched)
  );
  const contextNote =
    completedWithFeedback.length > 0
      ? `Viewer has completed ${completedWithFeedback.length} relationship(s). ` +
        `Average rating received: ${avgRating(relationships, viewerId).toFixed(1)}/5. ` +
        `Prioritise matches that differ from past ones to avoid repetition.`
      : "";

  try {
    const matches = await getMatches(viewer, candidates, 3, weights, contextNote);
    return NextResponse.json({ matches });
  } catch (err) {
    console.error("Match engine error:", err);
    return NextResponse.json({ error: "Matching failed" }, { status: 500 });
  }
}

function avgRating(relationships: Relationship[], actorId: string): number {
  const ratings: number[] = [];
  for (const r of relationships) {
    if (r.viewerId === actorId && r.feedbackFromViewer) ratings.push(r.feedbackFromViewer.rating);
    if (r.matchedId === actorId && r.feedbackFromMatched) ratings.push(r.feedbackFromMatched.rating);
  }
  return ratings.length === 0 ? 0 : ratings.reduce((a, b) => a + b) / ratings.length;
}
