import type { ActorProfile } from "./profiles";
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

  try {
    const results: MatchResult[] = JSON.parse(cleanResponse);
    return results.sort((a, b) => b.score - a.score).slice(0, topN);
  } catch {
    console.error("Failed to parse Gemma response:", cleanResponse);
    throw new Error("Invalid AI response format from match engine");
  }
}
