import assert from "node:assert/strict";
import test from "node:test";

import { excludeExistingMatches, getDeterministicMatches } from "../src/lib/match-engine.ts";
import { findProfile, getCandidatesFor } from "../src/lib/profiles.ts";
import { getRelationshipsForActor } from "../src/lib/store.ts";
import type { WeightOverrides } from "../src/lib/weight-engine.ts";

test("deterministic matcher returns ranked compatible candidates without Ollama", () => {
  const viewer = findProfile("founder-aisha");
  assert.ok(viewer);

  const matches = getDeterministicMatches(viewer, getCandidatesFor(viewer), 3);

  assert.equal(matches.length, 3);
  assert.equal(matches[0].id, "mentor-james");
  assert.ok(matches[0].score > matches[1].score);
  assert.ok(matches[0].rationale.includes("fintech"));
  assert.ok(matches[0].flags.length >= 1);
  assert.ok(matches[0].score <= 100);
});

test("existing relationships are excluded before ranking new matches", () => {
  const viewer = findProfile("founder-aisha");
  assert.ok(viewer);

  const freshCandidates = excludeExistingMatches(
    viewer.id,
    getCandidatesFor(viewer),
    getRelationshipsForActor(viewer.id)
  );

  const freshIds = freshCandidates.map((candidate) => candidate.id);
  assert.deepEqual(freshIds, ["mentor-sarah", "mentor-mei", "investor-greenlight", "investor-orbit"]);
});

test("weight boosts can increase a dimension without pushing total score above 100", () => {
  const viewer = findProfile("founder-aisha");
  const candidate = findProfile("mentor-james");
  assert.ok(viewer);
  assert.ok(candidate);

  const weights: WeightOverrides = {
    domain_fit: 1.2,
    stage_fit: 1,
    geography: 1,
    history: 1,
    availability: 1,
  };

  const [baseline] = getDeterministicMatches(viewer, [candidate], 1);
  const [match] = getDeterministicMatches(viewer, [candidate], 1, weights);

  assert.ok(match.breakdown.domain_fit > baseline.breakdown.domain_fit);
  assert.ok(match.score <= 100);
});
