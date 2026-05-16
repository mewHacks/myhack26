"use client";

import { useEffect, useState } from "react";

import type { MatchResult } from "@/lib/match-engine";

type UseAiMatchesResult = {
  matches: MatchResult[];
  loading: boolean;
  error: string | null;
};

export function useAiMatches(viewerId: string): UseAiMatchesResult {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewerId }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setMatches(data.matches ?? []);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [viewerId]);

  return { matches, loading, error };
}
