# Record Tracking & Feedback Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a post-session 1–5 feedback system that computes a live profile strength score (0–100) and re-weights future Gemma match prompts based on historical outcome patterns.

**Architecture:** An in-memory singleton store (`store.ts`) holds all relationships and feedback — no database needed for the hackathon demo. A pure `strength-calculator.ts` computes scores from that data. A `weight-engine.ts` derives dimension weight multipliers from feedback history and injects them into the Gemma prompt. UI layers sit on top of three new API routes.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind v4, `motion/react`, existing Gemma/Ollama match engine.

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `src/lib/store.ts` | Singleton in-memory store — relationships, feedback, sessions |
| Create | `src/lib/strength-calculator.ts` | Pure fn: profiles + store data → strength score 0–100 |
| Create | `src/lib/weight-engine.ts` | Pure fn: store history → dimension weight multipliers for Gemma |
| Modify | `src/lib/match-engine.ts` | Accept `weightOverrides` + `contextNote` params; inject into prompt |
| Modify | `src/app/api/match/route.ts` | Compute weight overrides before calling `getMatches` |
| Create | `src/app/api/relationships/route.ts` | GET viewer's relationships; POST create relationship |
| Create | `src/app/api/feedback/[id]/route.ts` | POST submit 1–5 rating for a relationship |
| Create | `src/app/api/profile-strength/[id]/route.ts` | GET computed strength score for any actor |
| Create | `src/components/relationship-card.tsx` | Single relationship row: status badge, score, session count, feedback button |
| Create | `src/components/feedback-widget.tsx` | Star rating UI (1–5) with submit — renders inside relationship card |
| Create | `src/components/profile-strength-badge.tsx` | Animated 0–100 score ring with label |
| Create | `src/components/relationship-dashboard.tsx` | Full dashboard: strength badge + list of relationship cards |

---

## Task 1 — In-Memory Store

**Files:**
- Create: `src/lib/store.ts`

### Data model

```ts
// A directional connection between two actors created after an AI match
type Relationship = {
  id: string                          // "rel_" + nanoid
  viewerId: string                    // who initiated (the viewer)
  matchedId: string                   // the matched profile id
  type: "mentor:founder" | "investor:founder" | "mentor:investor"
  status: "pending" | "active" | "completed"
  matchScore: number                  // Gemma score at creation time
  rationale: string                   // Gemma rationale at creation time
  sessionCount: number
  feedbackFromViewer?: FeedbackEntry
  feedbackFromMatched?: FeedbackEntry
  createdAt: number                   // Date.now()
  completedAt?: number
}

type FeedbackEntry = {
  rating: number          // 1–5
  comment: string
  submittedAt: number
}
```

### Strength score components (used by strength-calculator.ts)

```
completeness  (0–30)  profile fields filled, description length, tags count
engagement    (0–40)  total relationships created + sessions logged
feedback      (0–30)  average rating received × 6  (5.0 → 30, 1.0 → 6, no data → 15)
```

- [ ] **Step 1: Create `src/lib/store.ts`**

```ts
export type FeedbackEntry = {
  rating: number;
  comment: string;
  submittedAt: number;
};

// Defined here (not in match-engine.ts) to avoid circular imports:
// store → match-engine → weight-engine → store
export type MatchBreakdown = {
  domain_fit: number;
  stage_fit: number;
  geography: number;
  history: number;
  availability: number;
};

export type Relationship = {
  id: string;
  viewerId: string;
  matchedId: string;
  type: "mentor:founder" | "investor:founder" | "mentor:investor";
  status: "pending" | "active" | "completed";
  matchScore: number;
  rationale: string;
  breakdown?: MatchBreakdown; // stored at creation; enables weight re-weighting in weight-engine.ts
  sessionCount: number;
  feedbackFromViewer?: FeedbackEntry;
  feedbackFromMatched?: FeedbackEntry;
  createdAt: number;
  completedAt?: number;
};

// Singleton store — persists for the lifetime of the Next.js server process.
// In dev, module is hot-reloaded so state resets; that's fine for hackathon demo.
const store: { relationships: Relationship[] } = {
  relationships: [],
};

export function getRelationships(): Relationship[] {
  return store.relationships;
}

export function getRelationshipsForActor(actorId: string): Relationship[] {
  return store.relationships.filter(
    (r) => r.viewerId === actorId || r.matchedId === actorId
  );
}

export function findRelationship(id: string): Relationship | undefined {
  return store.relationships.find((r) => r.id === id);
}

export function createRelationship(data: Omit<Relationship, "id" | "createdAt" | "sessionCount">): Relationship {
  const rel: Relationship = {
    ...data,
    id: `rel_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    sessionCount: 0,
    createdAt: Date.now(),
  };
  store.relationships.push(rel);
  return rel;
}

export function submitFeedback(
  relationshipId: string,
  side: "viewer" | "matched",
  entry: FeedbackEntry
): Relationship | null {
  const rel = findRelationship(relationshipId);
  if (!rel) return null;

  if (side === "viewer") {
    rel.feedbackFromViewer = entry;
  } else {
    rel.feedbackFromMatched = entry;
  }

  // Auto-complete when both sides have rated
  if (rel.feedbackFromViewer && rel.feedbackFromMatched) {
    rel.status = "completed";
    rel.completedAt = Date.now();
  } else if (rel.status === "pending") {
    rel.status = "active";
  }

  return rel;
}

export function incrementSessions(relationshipId: string): Relationship | null {
  const rel = findRelationship(relationshipId);
  if (!rel) return null;
  rel.sessionCount += 1;
  return rel;
}
```

- [ ] **Step 2: Seed demo data so the dashboard isn't empty on first load**

Add this at the bottom of `src/lib/store.ts`:

```ts
// Seed demo relationships so the dashboard has content on first load
function seedDemoData() {
  if (store.relationships.length > 0) return;

  createRelationship({
    viewerId: "founder-aisha",
    matchedId: "mentor-james",
    type: "mentor:founder",
    status: "active",
    matchScore: 87,
    rationale: "James's fintech payments expertise directly matches PayChain's B2B SaaS stage.",
    breakdown: { domain_fit: 26, stage_fit: 22, geography: 14, history: 18, availability: 7 },
  });

  const completed = createRelationship({
    viewerId: "founder-aisha",
    matchedId: "investor-northstar",
    type: "investor:founder",
    status: "pending",
    matchScore: 74,
    rationale: "Northstar's B2B SaaS thesis aligns with PayChain's seed stage and SEA focus.",
    breakdown: { domain_fit: 22, stage_fit: 20, geography: 12, history: 14, availability: 6 },
  });

  // One completed relationship with feedback already submitted — provides weight signal
  submitFeedback(completed.id, "viewer", {
    rating: 5,
    comment: "Incredibly useful intro, opened two warm VC doors.",
    submittedAt: Date.now() - 86400000,
  });
  submitFeedback(completed.id, "matched", {
    rating: 4,
    comment: "Strong traction signals, will track for next round.",
    submittedAt: Date.now() - 82800000,
  });
}

seedDemoData();
```

- [ ] **Step 3: Verify store compiles — check for obvious type errors by reading through and confirming all property accesses match the `Relationship` type**

---

## Task 2 — Strength Calculator

**Files:**
- Create: `src/lib/strength-calculator.ts`

- [ ] **Step 1: Create `src/lib/strength-calculator.ts`**

```ts
import type { ActorProfile } from "./profiles";
import type { Relationship } from "./store";

export type StrengthScore = {
  total: number;          // 0–100
  completeness: number;   // 0–30
  engagement: number;     // 0–40
  feedback: number;       // 0–30
  label: "New" | "Growing" | "Established" | "Top";
};

function computeCompleteness(profile: ActorProfile): number {
  let pts = 0;

  // All types have: id, name, type, geography, remote_friendly, description, image
  if (profile.description.length >= 80) pts += 10;
  else if (profile.description.length >= 40) pts += 5;

  if (profile.type === "mentor") {
    pts += Math.min(profile.expertise.length * 3, 12); // up to 12
    if (profile.past_outcomes.length > 20) pts += 8;
  } else if (profile.type === "founder") {
    pts += Math.min(profile.sector.length * 3, 9);
    if (profile.traction.length > 10) pts += 12;
    pts += Math.min(profile.looking_for.length * 2, 9);
  } else {
    // investor
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
    Math.min(activeCount * 6, 18) +   // up to 18 for active relationships
    Math.min(completedCount * 4, 12) + // up to 12 for completed
    Math.min(totalSessions * 2, 10);   // up to 10 for sessions

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

  if (ratingsReceived.length === 0) return 15; // default mid-point for new actors

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
```

---

## Task 3 — Weight Engine

**Files:**
- Create: `src/lib/weight-engine.ts`

The weight engine looks at which dimension scores correlated with high-feedback matches for a given actor, then returns multipliers the match prompt uses to up-weight or down-weight each dimension.

- [ ] **Step 1: Create `src/lib/weight-engine.ts`**

```ts
import type { MatchBreakdown, Relationship } from "./store";

export type WeightOverrides = {
  domain_fit: number;    // multiplier, e.g. 1.15 = +15%
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

  if (completed.length < 2) return DEFAULT_WEIGHTS; // not enough signal

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

    // If high-rated matches scored notably higher on this dimension, boost it
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
```

---

## Task 4 — Update Match Engine to Accept Weight Overrides

**Files:**
- Modify: `src/lib/match-engine.ts`

- [ ] **Step 1: Update `buildPrompt` to accept and inject weight overrides**

Replace the `buildPrompt` function signature and body in `src/lib/match-engine.ts`:

```ts
import type { WeightOverrides } from "./weight-engine";

function buildPrompt(
  viewer: ActorProfile,
  candidates: ActorProfile[],
  weights: WeightOverrides,
  contextNote: string
): string {
  const w = weights;
  const domainMax = Math.round(30 * w.domain_fit);
  const stageMax = Math.round(25 * w.stage_fit);
  const geoMax = Math.round(15 * w.geography);
  const historyMax = Math.round(20 * w.history);
  const availMax = Math.round(10 * w.availability);
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
```

- [ ] **Step 2: Update `getMatches` signature to accept weight overrides**

Replace the `getMatches` export in `src/lib/match-engine.ts`:

```ts
import type { WeightOverrides } from "./weight-engine";
import { DEFAULT_WEIGHTS } from "./weight-engine";

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
```

---

## Task 5 — Update Match API Route

**Files:**
- Modify: `src/app/api/match/route.ts`

- [ ] **Step 1: Replace `src/app/api/match/route.ts` entirely**

```ts
import { NextRequest, NextResponse } from "next/server";

import { getMatches } from "@/lib/match-engine";
import { findProfile, getCandidatesFor } from "@/lib/profiles";
import { getRelationshipsForActor } from "@/lib/store";
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

  // Build a short context note from feedback history for the prompt
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

function avgRating(relationships: ReturnType<typeof getRelationshipsForActor>, actorId: string): number {
  const ratings: number[] = [];
  for (const r of relationships) {
    if (r.viewerId === actorId && r.feedbackFromViewer) ratings.push(r.feedbackFromViewer.rating);
    if (r.matchedId === actorId && r.feedbackFromMatched) ratings.push(r.feedbackFromMatched.rating);
  }
  return ratings.length === 0 ? 0 : ratings.reduce((a, b) => a + b) / ratings.length;
}
```

---

## Task 6 — Relationships API Route

**Files:**
- Create: `src/app/api/relationships/route.ts`

- [ ] **Step 1: Create directory and file**

```bash
mkdir -p src/app/api/relationships
```

- [ ] **Step 2: Create `src/app/api/relationships/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";

import { findProfile } from "@/lib/profiles";
import { createRelationship, getRelationshipsForActor } from "@/lib/store";

export async function GET(req: NextRequest) {
  const viewerId = req.nextUrl.searchParams.get("viewerId");
  if (!viewerId) {
    return NextResponse.json({ error: "viewerId required" }, { status: 400 });
  }
  const relationships = getRelationshipsForActor(viewerId);
  return NextResponse.json({ relationships });
}

export async function POST(req: NextRequest) {
  const { viewerId, matchedId, matchScore, rationale, breakdown } = await req.json();

  if (!viewerId || !matchedId || matchScore == null) {
    return NextResponse.json({ error: "viewerId, matchedId, matchScore required" }, { status: 400 });
  }

  const viewer = findProfile(viewerId);
  const matched = findProfile(matchedId);
  if (!viewer || !matched) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const type =
    viewer.type === "mentor" || matched.type === "mentor"
      ? "mentor:founder"
      : "investor:founder";

  const rel = createRelationship({
    viewerId,
    matchedId,
    type: type as "mentor:founder" | "investor:founder" | "mentor:investor",
    status: "pending",
    matchScore,
    rationale: rationale ?? "",
    breakdown: breakdown ?? undefined, // stored for weight-engine correlation analysis
  });

  return NextResponse.json({ relationship: rel });
}
```

---

## Task 7 — Feedback API Route

**Files:**
- Create: `src/app/api/feedback/[id]/route.ts`

- [ ] **Step 1: Create directory**

```bash
mkdir -p src/app/api/feedback/\[id\]
```

- [ ] **Step 2: Create `src/app/api/feedback/[id]/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";

import { submitFeedback } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { side, rating, comment = "" } = await req.json();

  if (!side || rating == null) {
    return NextResponse.json({ error: "side and rating required" }, { status: 400 });
  }

  if (!["viewer", "matched"].includes(side)) {
    return NextResponse.json({ error: "side must be viewer or matched" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating must be 1–5" }, { status: 400 });
  }

  const rel = submitFeedback(id, side as "viewer" | "matched", {
    rating,
    comment,
    submittedAt: Date.now(),
  });

  if (!rel) {
    return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
  }

  return NextResponse.json({ relationship: rel });
}
```

---

## Task 8 — Profile Strength API Route

**Files:**
- Create: `src/app/api/profile-strength/[id]/route.ts`

- [ ] **Step 1: Create directory**

```bash
mkdir -p src/app/api/profile-strength/\[id\]
```

- [ ] **Step 2: Create `src/app/api/profile-strength/[id]/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";

import { findProfile } from "@/lib/profiles";
import { computeStrength } from "@/lib/strength-calculator";
import { getRelationships } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const profile = findProfile(id);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const allRelationships = getRelationships();
  const strength = computeStrength(profile, allRelationships);

  return NextResponse.json({ strength });
}
```

---

## Task 9 — Profile Strength Badge Component

**Files:**
- Create: `src/components/profile-strength-badge.tsx`

- [ ] **Step 1: Create `src/components/profile-strength-badge.tsx`**

```tsx
import type { StrengthScore } from "@/lib/strength-calculator";

type ProfileStrengthBadgeProps = {
  strength: StrengthScore;
  size?: "sm" | "md" | "lg";
};

const labelColors: Record<StrengthScore["label"], string> = {
  New: "text-muted",
  Growing: "text-[var(--color-google-blue)]",
  Established: "text-[var(--color-google-yellow)]",
  Top: "text-[var(--color-google-green)]",
};

const barColors: Record<StrengthScore["label"], string> = {
  New: "bg-muted",
  Growing: "bg-[var(--color-google-blue)]",
  Established: "bg-[var(--color-google-yellow)]",
  Top: "bg-[var(--color-google-green)]",
};

export function ProfileStrengthBadge({ strength, size = "md" }: ProfileStrengthBadgeProps) {
  const pct = strength.total;
  const isLg = size === "lg";

  return (
    <div className={`space-y-${isLg ? "4" : "2"}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-[0.2em] text-muted`}>
          Profile Strength
        </span>
        <span className={`font-bold tabular-nums ${labelColors[strength.label]} ${isLg ? "text-2xl" : "text-base"}`}>
          {strength.total}
          <span className="text-xs font-normal text-muted">/100</span>
        </span>
      </div>

      {/* Main bar */}
      <div className="h-2 w-full rounded-full bg-black/8">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColors[strength.label]}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Label */}
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${labelColors[strength.label]}`}>
          {strength.label}
        </span>
        <span className="text-xs text-muted">
          — completeness {strength.completeness}/30 · engagement {strength.engagement}/40 · feedback {strength.feedback}/30
        </span>
      </div>
    </div>
  );
}
```

---

## Task 10 — Feedback Widget Component

**Files:**
- Create: `src/components/feedback-widget.tsx`

- [ ] **Step 1: Create `src/components/feedback-widget.tsx`**

```tsx
"use client";

import { useState } from "react";

type FeedbackWidgetProps = {
  relationshipId: string;
  side: "viewer" | "matched";
  onSubmitted?: (rating: number) => void;
};

export function FeedbackWidget({ relationshipId, side, onSubmitted }: FeedbackWidgetProps) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (selected === 0) return;
    setSubmitting(true);

    await fetch(`/api/feedback/${relationshipId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ side, rating: selected, comment }),
    });

    setSubmitting(false);
    setDone(true);
    onSubmitted?.(selected);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-card px-4 py-3 text-sm font-medium text-[var(--color-google-green)]">
        ✓ Feedback submitted — your score will update shortly
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-line bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Rate this session</p>

      {/* Star row */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl transition-transform hover:scale-110 ${
              star <= (hovered || selected) ? "text-[var(--color-google-yellow)]" : "text-muted"
            }`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setSelected(star)}
          >
            ★
          </button>
        ))}
        {selected > 0 && (
          <span className="ml-2 self-center text-sm font-semibold text-foreground">
            {["", "Poor", "Fair", "Good", "Great", "Excellent"][selected]}
          </span>
        )}
      </div>

      {/* Optional comment */}
      {selected > 0 && (
        <textarea
          className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted focus:border-foreground"
          placeholder="Add a note (optional)…"
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      )}

      <button
        type="button"
        disabled={selected === 0 || submitting}
        onClick={submit}
        className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-40 hover:opacity-80"
      >
        {submitting ? "Submitting…" : "Submit rating"}
      </button>
    </div>
  );
}
```

---

## Task 11 — Relationship Card Component

**Files:**
- Create: `src/components/relationship-card.tsx`

- [ ] **Step 1: Create `src/components/relationship-card.tsx`**

```tsx
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
  const matchedProfile = allProfiles.find((p) => p.id === rel.matchedId);
  const side = rel.viewerId === viewerId ? "viewer" : "matched";
  const myFeedback = side === "viewer" ? rel.feedbackFromViewer : rel.feedbackFromMatched;
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
        {rel.feedbackFromViewer && (
          <span>Your rating <strong className="text-foreground">{rel.feedbackFromViewer.rating}/5</strong></span>
        )}
        {rel.feedbackFromMatched && (
          <span>Their rating <strong className="text-foreground">{rel.feedbackFromMatched.rating}/5</strong></span>
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
```

---

## Task 12 — Relationship Dashboard Component

**Files:**
- Create: `src/components/relationship-dashboard.tsx`

- [ ] **Step 1: Create `src/components/relationship-dashboard.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

import { ProfileStrengthBadge } from "@/components/profile-strength-badge";
import { RelationshipCard } from "@/components/relationship-card";
import type { StrengthScore } from "@/lib/strength-calculator";
import type { Relationship } from "@/lib/store";

type RelationshipDashboardProps = {
  viewerId: string;
};

export function RelationshipDashboard({ viewerId }: RelationshipDashboardProps) {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [strength, setStrength] = useState<StrengthScore | null>(null);
  const [loading, setLoading] = useState(true);

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

    return () => { cancelled = true; };
  }, [viewerId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-[1.75rem] border border-line bg-card" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {strength && (
        <div className="rounded-[1.75rem] border border-line bg-card p-6">
          <ProfileStrengthBadge strength={strength} size="lg" />
        </div>
      )}

      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Your Connections ({relationships.length})
        </p>
        {relationships.length === 0 ? (
          <p className="text-sm text-muted">No connections yet — connect with an AI match to get started.</p>
        ) : (
          <div className="space-y-3">
            {relationships.map((rel) => (
              <RelationshipCard key={rel.id} relationship={rel} viewerId={viewerId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Task 13 — Add Dashboard Route

**Files:**
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Create dashboard page at `/dashboard`**

```bash
mkdir -p src/app/dashboard
```

- [ ] **Step 2: Create `src/app/dashboard/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { RelationshipDashboard } from "@/components/relationship-dashboard";
import NavHeader from "@/components/ui/nav-header";
import { headerLinks } from "@/lib/browse-page-content";

export const metadata: Metadata = {
  title: "Dashboard | Covalent",
};

// For demo: hardcoded viewer — in production this comes from auth session
const DEMO_VIEWER_ID = "founder-aisha";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-6 sm:px-10 lg:px-12 lg:py-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-line bg-card px-5 py-3">
        <Link href="/" className="text-lg leading-none">
          <BrandMark />
        </Link>
        <div className="flex items-center justify-self-center gap-3">
          <span className="text-lg font-medium text-foreground sm:text-xl">I&apos;m a</span>
          <NavHeader items={headerLinks} />
        </div>
        <Link href="/" className="justify-self-end text-sm font-medium text-muted transition hover:text-foreground">
          Sign in
        </Link>
      </header>

      <section className="rounded-[1.75rem] border border-line bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_58%,rgba(66,133,244,0.18)_100%)] p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Your Activity</p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Connection Dashboard</h1>
        </div>
        <RelationshipDashboard viewerId={DEMO_VIEWER_ID} />
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Add Dashboard link to the home nav** — edit the `headerLinks` array in `src/app/page.tsx` to add a dashboard entry, OR add a "Dashboard" button to the header:

In `src/app/page.tsx`, add this link next to "Sign in":
```tsx
<Link
  href="/dashboard"
  className="justify-self-end text-sm font-medium text-foreground border border-line rounded-full px-4 py-1.5 transition hover:bg-black/4"
>
  Dashboard
</Link>
```

---

## Task 14 — Wire "Connect" Button to Create Relationship

The `AiMatchCard` shows a CTA button ("Book mentor", "Request intro"). Right now it does nothing. Wire it to `POST /api/relationships`.

**Files:**
- Modify: `src/components/ai-match-card.tsx`

- [ ] **Step 1: Add `onConnect` handler to `AiMatchCard`**

Add a `handleConnect` async function and wire the CTA button. Replace the CTA `<span>` at the bottom of `AiMatchCard`:

```tsx
// Add to top of component:
const [connected, setConnected] = useState(false);
const [connecting, setConnecting] = useState(false);

async function handleConnect() {
  setConnecting(true);
  await fetch("/api/relationships", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      viewerId: "founder-aisha", // demo: hardcoded
      matchedId: match.id,
      matchScore: match.score,
      rationale: match.rationale,
      breakdown: match.breakdown, // saved for weight-engine correlation analysis
    }),
  });
  setConnecting(false);
  setConnected(true);
}

// Replace the CTA span with:
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
```

---

## Self-Review

**Spec coverage:**
- ✅ Post-session 1–5 rating → `FeedbackWidget` + `POST /api/feedback/[id]`
- ✅ Profile strength score (0–100) → `strength-calculator.ts` + `ProfileStrengthBadge`
- ✅ Score updates after feedback → `computeStrength` reads live store data, API route is always fresh
- ✅ Re-weights future matches → `weight-engine.ts` + updated `buildPrompt` with dynamic dimension maxes
- ✅ Record tracking (relationship lifecycle) → `store.ts` + `relationships` API + `RelationshipCard`
- ✅ Demo-ready dashboard → `/dashboard` page with seeded data

**Type consistency check:**
- `Relationship` type defined in `store.ts` — used in `strength-calculator.ts`, `weight-engine.ts`, `relationship-card.tsx`, `relationship-dashboard.tsx` ✅
- `StrengthScore` defined in `strength-calculator.ts` — used in `profile-strength-badge.tsx`, `relationship-dashboard.tsx` ✅
- `WeightOverrides` defined in `weight-engine.ts` — used in `match-engine.ts`, `match/route.ts` ✅
- `FeedbackEntry` defined in `store.ts` — used in `feedback/[id]/route.ts`, `store.ts` ✅
- `getMatches(viewer, candidates, topN, weights, contextNote)` — 5 params, all optional after topN ✅

**Placeholder scan:** No TBDs, TODOs, or "similar to task N" found. All code blocks are complete. ✅
