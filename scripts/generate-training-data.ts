/**
 * Generates JSONL training data for LoRA fine-tuning.
 * Uses the deterministic matcher as ground truth so the LLM learns
 * to replicate the same scoring logic but in natural language.
 *
 * Usage:
 *   node --import jiti/register scripts/generate-training-data.ts > training-data.jsonl
 *   node --import jiti/register scripts/generate-training-data.ts --validate
 */

import { writeFileSync } from "fs";
import { allProfiles, getCandidatesFor } from "../src/lib/profiles";
import { getDeterministicMatches } from "../src/lib/match-engine";
import { DEFAULT_WEIGHTS, type WeightOverrides } from "../src/lib/weight-engine";

const VALIDATE = process.argv.includes("--validate");

// Weight variants to teach the model that dimension weights affect scores
const WEIGHT_VARIANTS: { label: string; weights: WeightOverrides }[] = [
  { label: "default", weights: DEFAULT_WEIGHTS },
  {
    label: "domain-heavy",
    weights: { ...DEFAULT_WEIGHTS, domain_fit: 1.5, stage_fit: 0.8 },
  },
  {
    label: "geo-heavy",
    weights: { ...DEFAULT_WEIGHTS, geography: 2.0, history: 0.7 },
  },
  {
    label: "availability-heavy",
    weights: { ...DEFAULT_WEIGHTS, availability: 2.0, domain_fit: 0.8 },
  },
  {
    label: "history-heavy",
    weights: { ...DEFAULT_WEIGHTS, history: 1.8, geography: 0.6 },
  },
];

function buildPrompt(
  viewer: (typeof allProfiles)[0],
  candidates: (typeof allProfiles)[number][],
  weights: WeightOverrides
): string {
  const domainMax = Math.round(30 * weights.domain_fit);
  const stageMax = Math.round(25 * weights.stage_fit);
  const geoMax = Math.round(15 * weights.geography);
  const historyMax = Math.round(20 * weights.history);
  const availMax = Math.round(10 * weights.availability);
  const total = domainMax + stageMax + geoMax + historyMax + availMax;

  return `You are a startup ecosystem matching engine. Score each candidate for compatibility with the viewer.
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

type TrainingExample = { prompt: string; completion: string };

function generate(): TrainingExample[] {
  const examples: TrainingExample[] = [];

  for (const viewer of allProfiles) {
    const candidates = getCandidatesFor(viewer);
    if (candidates.length === 0) continue;

    for (const { weights } of WEIGHT_VARIANTS) {
      const matches = getDeterministicMatches(viewer, candidates, candidates.length, weights);

      const prompt = buildPrompt(viewer, candidates, weights);
      const completion = JSON.stringify(matches);

      examples.push({ prompt, completion });

      // Also generate subset examples (top-3 only) to teach ranking behaviour
      if (candidates.length > 3) {
        const subsetCandidates = candidates.slice(0, 4);
        const subsetMatches = getDeterministicMatches(viewer, subsetCandidates, subsetCandidates.length, weights);
        examples.push({
          prompt: buildPrompt(viewer, subsetCandidates, weights),
          completion: JSON.stringify(subsetMatches),
        });
      }
    }
  }

  return examples;
}

function validate(examples: TrainingExample[]): void {
  let passed = 0;
  let failed = 0;

  for (const ex of examples) {
    try {
      const parsed = JSON.parse(ex.completion);
      if (!Array.isArray(parsed)) throw new Error("completion is not an array");
      for (const item of parsed) {
        if (typeof item.id !== "string") throw new Error("missing id");
        if (typeof item.score !== "number") throw new Error("missing score");
        if (typeof item.rationale !== "string") throw new Error("missing rationale");
        if (!Array.isArray(item.flags)) throw new Error("missing flags");
        if (typeof item.breakdown !== "object") throw new Error("missing breakdown");
      }
      passed++;
    } catch (err) {
      failed++;
      process.stderr.write(`FAIL: ${err instanceof Error ? err.message : err}\n`);
      process.stderr.write(`  completion: ${ex.completion.slice(0, 120)}...\n`);
    }
  }

  process.stderr.write(`\nValidation: ${passed} passed, ${failed} failed out of ${examples.length} examples\n`);
  if (failed > 0) process.exit(1);
}

const examples = generate();

if (VALIDATE) {
  validate(examples);
} else {
  const jsonl = examples.map((ex) => JSON.stringify(ex)).join("\n");
  process.stdout.write(jsonl + "\n");
  process.stderr.write(`Generated ${examples.length} training examples\n`);
}
