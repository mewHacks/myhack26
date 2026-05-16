import assert from "node:assert/strict";
import test from "node:test";

import { excludeExistingMatches, getDeterministicMatches } from "../src/lib/match-engine.ts";
import { findProfile, getCandidatesFor } from "../src/lib/profiles.ts";
import { getRelationshipsForActor } from "../src/lib/store.ts";

test("deterministic matcher returns ranked compatible candidates without Ollama", () => {
  const viewer = findProfile("founder-aisha");
  assert.ok(viewer);

  const matches = getDeterministicMatches(viewer, getCandidatesFor(viewer), 3);

  assert.equal(matches.length, 3);
  assert.equal(matches[0].id, "mentor-james");
  assert.ok(matches[0].score > matches[1].score);
  assert.ok(matches[0].rationale.includes("fintech"));
  assert.ok(matches[0].flags.length >= 1);
  assert.equal(
    matches[0].score,
    Object.values(matches[0].breakdown).reduce((sum, value) => sum + value, 0)
  );
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
