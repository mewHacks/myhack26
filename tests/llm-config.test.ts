import assert from "node:assert/strict";
import { test } from "node:test";

import { resolveLlmProvider } from "../src/lib/llm-config.ts";

test("resolveLlmProvider defaults to ollama", () => {
  assert.equal(resolveLlmProvider({}), "ollama");
});

test("resolveLlmProvider uses gemini when key set and no explicit provider", () => {
  assert.equal(resolveLlmProvider({ GEMINI_API_KEY: "x" }), "gemini");
});

test("resolveLlmProvider respects explicit ollama", () => {
  assert.equal(
    resolveLlmProvider({ LLM_PROVIDER: "ollama", GEMINI_API_KEY: "x" }),
    "ollama"
  );
});
