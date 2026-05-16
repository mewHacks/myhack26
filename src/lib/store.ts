export type FeedbackEntry = {
  rating: number;
  comment: string;
  submittedAt: number;
};

// Defined here (not in match-engine.ts) to avoid circular imports
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
  breakdown?: MatchBreakdown;
  sessionCount: number;
  feedbackFromViewer?: FeedbackEntry;
  feedbackFromMatched?: FeedbackEntry;
  createdAt: number;
  completedAt?: number;
};

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

// Seed demo data so dashboard has content on first load
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

  // Second completed relationship — needed so weight engine has >= 2 records to compute multipliers
  const completed2 = createRelationship({
    viewerId: "founder-aisha",
    matchedId: "mentor-raj",
    type: "mentor:founder",
    status: "pending",
    matchScore: 79,
    rationale: "Raj's B2C growth expertise matches SkillLoop's user acquisition challenge.",
    breakdown: { domain_fit: 20, stage_fit: 22, geography: 13, history: 16, availability: 8 },
  });
  submitFeedback(completed2.id, "viewer", {
    rating: 4,
    comment: "Great GTM tactics, very actionable.",
    submittedAt: Date.now() - 172800000,
  });
  submitFeedback(completed2.id, "matched", {
    rating: 4,
    comment: "Founder is focused and coachable.",
    submittedAt: Date.now() - 169200000,
  });
}

seedDemoData();
