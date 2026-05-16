import type { ActorProfile } from "./profiles";
import type { Relationship } from "./store";

export type StrengthScore = {
  total: number;
  completeness: number;
  engagement: number;
  feedback: number;
  label: "New" | "Growing" | "Established" | "Top";
};

function computeCompleteness(profile: ActorProfile): number {
  let pts = 0;

  if (profile.description.length >= 80) pts += 10;
  else if (profile.description.length >= 40) pts += 5;

  if (profile.type === "mentor") {
    pts += Math.min(profile.expertise.length * 3, 12);
    if (profile.past_outcomes.length > 20) pts += 8;
  } else if (profile.type === "founder") {
    pts += Math.min(profile.sector.length * 3, 9);
    if (profile.traction.length > 10) pts += 12;
    pts += Math.min(profile.looking_for.length * 2, 9);
  } else {
    pts += Math.min(profile.thesis.length * 3, 12);
    if (profile.check_size.length > 0) pts += 6;
    pts += Math.min(profile.geography.length * 2, 12);
  }

  return Math.min(pts, 30);
}

function computeEngagement(relationships: Relationship[], actorId: string): number {
  const myRels = relationships.filter(
    (r) => r.viewerId === actorId || r.matchedId === actorId
  );

  const activeCount = myRels.filter((r) => r.status !== "pending").length;
  const completedCount = myRels.filter((r) => r.status === "completed").length;
  const totalSessions = myRels.reduce((sum, r) => sum + r.sessionCount, 0);

  const pts =
    Math.min(activeCount * 6, 18) +
    Math.min(completedCount * 4, 12) +
    Math.min(totalSessions * 2, 10);

  return Math.min(pts, 40);
}

function computeFeedback(relationships: Relationship[], actorId: string): number {
  const ratingsReceived: number[] = [];

  for (const rel of relationships) {
    if (rel.viewerId === actorId && rel.feedbackFromMatched) {
      ratingsReceived.push(rel.feedbackFromMatched.rating);
    }
    if (rel.matchedId === actorId && rel.feedbackFromViewer) {
      ratingsReceived.push(rel.feedbackFromViewer.rating);
    }
  }

  if (ratingsReceived.length === 0) return 15;

  const avg = ratingsReceived.reduce((a, b) => a + b, 0) / ratingsReceived.length;
  return Math.round((avg / 5) * 30);
}

function scoreLabel(total: number): StrengthScore["label"] {
  if (total >= 75) return "Top";
  if (total >= 50) return "Established";
  if (total >= 25) return "Growing";
  return "New";
}

export function computeStrength(
  profile: ActorProfile,
  relationships: Relationship[]
): StrengthScore {
  const completeness = computeCompleteness(profile);
  const engagement = computeEngagement(relationships, profile.id);
  const feedback = computeFeedback(relationships, profile.id);
  const total = completeness + engagement + feedback;

  return { total, completeness, engagement, feedback, label: scoreLabel(total) };
}
