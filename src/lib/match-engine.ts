import type { ActorProfile } from "./profiles";
import type { Relationship } from "./store";
import type { WeightOverrides } from "./weight-engine";
import { DEFAULT_WEIGHTS } from "./weight-engine";

export type MatchBreakdown = {
  domain_fit: number;
  stage_fit: number;
  geography: number;
  history: number;
  availability: number;
};

export type MatchResult = {
  id: string;
  score: number;
  rationale: string;
  flags: string[];
  breakdown: MatchBreakdown;
};

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "gemma3";
const DIMENSION_MAXES: MatchBreakdown = {
  domain_fit: 30,
  stage_fit: 25,
  geography: 15,
  history: 20,
  availability: 10,
};

function buildPrompt(
  viewer: ActorProfile,
  candidates: ActorProfile[],
  weights: WeightOverrides,
  contextNote: string
): string {
  const domainMax = Math.round(30 * weights.domain_fit);
  const stageMax = Math.round(25 * weights.stage_fit);
  const geoMax = Math.round(15 * weights.geography);
  const historyMax = Math.round(20 * weights.history);
  const availMax = Math.round(10 * weights.availability);
  const total = domainMax + stageMax + geoMax + historyMax + availMax;

  return `You are a startup ecosystem matching engine. Score each candidate for compatibility with the viewer.
${contextNote ? `\nCONTEXT FROM PAST MATCHES:\n${contextNote}\n` : ""}
VIEWER:
${JSON.stringify(viewer, null, 2)}

CANDIDATES:
${JSON.stringify(candidates, null, 2)}

Score each candidate 0-${total} across these dimensions (weights adjusted from feedback history):
- domain_fit (max ${domainMax} pts): sector and expertise alignment
- stage_fit (max ${stageMax} pts): stage compatibility
- geography (max ${geoMax} pts): location match or remote friendliness
- history (max ${historyMax} pts): track record and outcome signals
- availability (max ${availMax} pts): timing, capacity, and fit urgency

Rules:
- total score = sum of all dimension scores, then normalise to 0-100
- rationale: one sentence explaining the top reason for the match
- flags: array of 1-2 short strings for weak points (prefix with "✗ ")
- Be specific — reference actual fields from the profiles

Return ONLY a valid JSON array with no markdown, no explanation, no code fences:
[{"id":"...","score":87,"rationale":"...","flags":["✗ ..."],"breakdown":{"domain_fit":26,"stage_fit":22,"geography":12,"history":18,"availability":9}}]`;
}

export async function getMatches(
  viewer: ActorProfile,
  candidates: ActorProfile[],
  topN = 3,
  weights: WeightOverrides = DEFAULT_WEIGHTS,
  contextNote = ""
): Promise<MatchResult[]> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: buildPrompt(viewer, candidates, weights, contextNote),
        stream: false,
        format: "json",
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let cleanResponse = data.response.trim();

    if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const results: MatchResult[] = JSON.parse(cleanResponse);
    const candidateIds = new Set(candidates.map((candidate) => candidate.id));
    const validResults = results.filter((result) => candidateIds.has(result.id));
    if (validResults.length === 0) {
      throw new Error("AI response did not include known candidates");
    }
    return validResults.sort((a, b) => b.score - a.score).slice(0, topN);
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown error";
    console.warn(`AI match engine unavailable; using deterministic fallback (${reason}).`);
    return getDeterministicMatches(viewer, candidates, topN, weights);
  }
}

export function getDeterministicMatches(
  viewer: ActorProfile,
  candidates: ActorProfile[],
  topN = 3,
  weights: WeightOverrides = DEFAULT_WEIGHTS
): MatchResult[] {
  return candidates
    .map((candidate) => scoreCandidate(viewer, candidate, weights))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

export function excludeExistingMatches(
  viewerId: string,
  candidates: ActorProfile[],
  relationships: Relationship[]
): ActorProfile[] {
  const existingIds = new Set(
    relationships.map((relationship) =>
      relationship.viewerId === viewerId ? relationship.matchedId : relationship.viewerId
    )
  );
  return candidates.filter((candidate) => !existingIds.has(candidate.id));
}

function scoreCandidate(
  viewer: ActorProfile,
  candidate: ActorProfile,
  weights: WeightOverrides
): MatchResult {
  const base = {
    domain_fit: Math.round(scoreDomainFit(viewer, candidate) * DIMENSION_MAXES.domain_fit),
    stage_fit: Math.round(scoreStageFit(viewer, candidate) * DIMENSION_MAXES.stage_fit),
    geography: Math.round(scoreGeography(viewer, candidate) * DIMENSION_MAXES.geography),
    history: Math.round(scoreHistory(candidate) * DIMENSION_MAXES.history),
    availability: Math.round(scoreAvailability(candidate) * DIMENSION_MAXES.availability),
  };

  const breakdown = applyWeights(base, weights);
  const score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  return {
    id: candidate.id,
    score,
    rationale: buildRationale(viewer, candidate),
    flags: buildFlags(viewer, candidate, base),
    breakdown,
  };
}

function applyWeights(
  base: MatchBreakdown,
  weights: WeightOverrides
): MatchBreakdown {
  return {
    domain_fit: clamp(Math.round(base.domain_fit * weights.domain_fit), 0, DIMENSION_MAXES.domain_fit),
    stage_fit: clamp(Math.round(base.stage_fit * weights.stage_fit), 0, DIMENSION_MAXES.stage_fit),
    geography: clamp(Math.round(base.geography * weights.geography), 0, DIMENSION_MAXES.geography),
    history: clamp(Math.round(base.history * weights.history), 0, DIMENSION_MAXES.history),
    availability: clamp(Math.round(base.availability * weights.availability), 0, DIMENSION_MAXES.availability),
  };
}

function scoreDomainFit(viewer: ActorProfile, candidate: ActorProfile): number {
  const viewerTags = domainTags(viewer);
  const candidateTags = domainTags(candidate);
  const overlap = viewerTags.filter((tag) => candidateTags.includes(tag)).length;
  const denominator = Math.max(1, Math.min(viewerTags.length, candidateTags.length));
  return clamp(overlap / denominator, 0.25, 1);
}

function scoreStageFit(viewer: ActorProfile, candidate: ActorProfile): number {
  const viewerStages = stageTags(viewer);
  const candidateStages = stageTags(candidate);
  if (viewerStages.some((stage) => candidateStages.includes(stage))) return 1;
  if (viewerStages.includes("pre-seed") && candidateStages.includes("seed")) return 0.75;
  if (viewerStages.includes("seed") && candidateStages.includes("series-a")) return 0.7;
  return 0.45;
}

function scoreGeography(viewer: ActorProfile, candidate: ActorProfile): number {
  const viewerLocations = geographyTags(viewer);
  const candidateLocations = geographyTags(candidate);
  if (viewerLocations.some((location) => candidateLocations.includes(location))) return 1;
  if (candidateLocations.includes("Malaysia") || candidateLocations.includes("SEA")) return 0.85;
  if (isRemoteFriendly(viewer) && isRemoteFriendly(candidate)) return 0.75;
  if (candidateLocations.includes("Global")) return 0.7;
  return 0.45;
}

function scoreHistory(candidate: ActorProfile): number {
  const text = historyText(candidate).toLowerCase();
  const strongSignals = ["raised", "series a", "exits", "unicorn", "contracts", "growth"];
  const hits = strongSignals.filter((signal) => text.includes(signal)).length;
  return clamp(0.55 + hits * 0.12, 0.55, 1);
}

function scoreAvailability(candidate: ActorProfile): number {
  if (candidate.type === "mentor") {
    if (candidate.availability === "high") return 1;
    if (candidate.availability === "medium") return 0.75;
    return 0.45;
  }
  return 0.75;
}

function buildRationale(viewer: ActorProfile, candidate: ActorProfile): string {
  const shared = domainTags(viewer).filter((tag) => domainTags(candidate).includes(tag));
  const sharedText = shared.length > 0 ? shared.slice(0, 2).join(" and ") : "ecosystem";
  return `${candidate.name}'s ${sharedText} fit aligns with ${displayName(viewer)}'s current needs.`;
}

function buildFlags(
  viewer: ActorProfile,
  candidate: ActorProfile,
  base: MatchBreakdown
): string[] {
  const flags: string[] = [];
  if (base.geography < DIMENSION_MAXES.geography * 0.7) {
    flags.push("✗ Geography may require remote coordination");
  }
  if (base.stage_fit < DIMENSION_MAXES.stage_fit * 0.7) {
    flags.push("✗ Stage focus is not a perfect match");
  }
  if (domainTags(viewer).filter((tag) => domainTags(candidate).includes(tag)).length === 0) {
    flags.push("✗ Limited direct sector overlap");
  }
  return flags.length > 0 ? flags.slice(0, 2) : ["✗ Validate availability before booking"];
}

function domainTags(profile: ActorProfile): string[] {
  if (profile.type === "founder") return [...profile.sector, ...profile.looking_for];
  if (profile.type === "mentor") return profile.expertise;
  return profile.thesis;
}

function stageTags(profile: ActorProfile): string[] {
  if (profile.type === "founder") return [profile.stage];
  if (profile.type === "mentor") return profile.stage_preference;
  return profile.stage;
}

function geographyTags(profile: ActorProfile): string[] {
  if (profile.type === "investor") return profile.geography;
  return [profile.geography];
}

function isRemoteFriendly(profile: ActorProfile): boolean {
  return profile.type !== "investor" && profile.remote_friendly;
}

function historyText(profile: ActorProfile): string {
  if (profile.type === "founder") return profile.traction;
  if (profile.type === "mentor") return profile.past_outcomes;
  return profile.description;
}

function displayName(profile: ActorProfile): string {
  return profile.type === "founder" ? profile.company : profile.name;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
