import type { MatchBreakdown, Relationship } from "./store";

export type WeightOverrides = {
  domain_fit: number;
  stage_fit: number;
  geography: number;
  history: number;
  availability: number;
};

export const DEFAULT_WEIGHTS: WeightOverrides = {
  domain_fit: 1.0,
  stage_fit: 1.0,
  geography: 1.0,
  history: 1.0,
  availability: 1.0,
};

export function computeWeightOverrides(
  actorId: string,
  relationships: Relationship[]
): WeightOverrides {
  const completed = relationships.filter(
    (r) =>
      (r.viewerId === actorId || r.matchedId === actorId) &&
      r.status === "completed" &&
      r.breakdown
  );

  if (completed.length < 2) return DEFAULT_WEIGHTS;

  const highRated = completed.filter((r) => {
    const ratings: number[] = [];
    if (r.viewerId === actorId && r.feedbackFromViewer) ratings.push(r.feedbackFromViewer.rating);
    if (r.matchedId === actorId && r.feedbackFromMatched) ratings.push(r.feedbackFromMatched.rating);
    return ratings.length > 0 && ratings.reduce((a, b) => a + b) / ratings.length >= 4.0;
  });

  if (highRated.length === 0) return DEFAULT_WEIGHTS;

  const keys: (keyof MatchBreakdown)[] = [
    "domain_fit", "stage_fit", "geography", "history", "availability",
  ];

  const maxes: Record<keyof MatchBreakdown, number> = {
    domain_fit: 30, stage_fit: 25, geography: 15, history: 20, availability: 10,
  };

  const overrides = { ...DEFAULT_WEIGHTS };

  for (const key of keys) {
    const avgAll = avg(completed.map((r) => (r.breakdown![key] / maxes[key]) * 100));
    const avgHigh = avg(highRated.map((r) => (r.breakdown![key] / maxes[key]) * 100));

    const diff = avgHigh - avgAll;
    if (diff > 10) overrides[key] = 1.2;
    else if (diff > 5) overrides[key] = 1.1;
    else if (diff < -10) overrides[key] = 0.85;
  }

  return overrides;
}

function avg(nums: number[]): number {
  return nums.length === 0 ? 0 : nums.reduce((a, b) => a + b, 0) / nums.length;
}
