import type { ActorProfile } from "./profiles";

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

function buildPrompt(viewer: ActorProfile, candidates: ActorProfile[]): string {
  return `You are a startup ecosystem matching engine. Score each candidate for compatibility with the viewer.

VIEWER:
${JSON.stringify(viewer, null, 2)}

CANDIDATES:
${JSON.stringify(candidates, null, 2)}

Score each candidate 0-100 across these dimensions:
- domain_fit (max 30 pts): sector and expertise alignment
- stage_fit (max 25 pts): stage compatibility
- geography (max 15 pts): location match or remote friendliness
- history (max 20 pts): track record and outcome signals
- availability (max 10 pts): timing, capacity, and fit urgency

Rules:
- total score = sum of all dimension scores
- rationale: one sentence explaining the top reason for the match
- flags: array of 1-2 short strings for weak points (prefix with "✗ ")
- Be specific — reference actual fields from the profiles

Return ONLY a valid JSON array with no markdown, no explanation, no code fences:
[{"id":"...","score":87,"rationale":"...","flags":["✗ ..."],"breakdown":{"domain_fit":26,"stage_fit":22,"geography":12,"history":18,"availability":9}}]`;
}

export async function getMatches(
  viewer: ActorProfile,
  candidates: ActorProfile[],
  topN = 3
): Promise<MatchResult[]> {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: buildPrompt(viewer, candidates),
      stream: false,
      format: "json",
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  let cleanResponse = data.response.trim();

  // Remove markdown code fences if present
  if (cleanResponse.startsWith("```")) {
    cleanResponse = cleanResponse.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  try {
    const results: MatchResult[] = JSON.parse(cleanResponse);
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);
  } catch (err) {
    console.error("Failed to parse Gemma response:", cleanResponse);
    throw new Error("Invalid AI response format from match engine");
  }
}
