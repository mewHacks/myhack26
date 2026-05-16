"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReviewActions({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  async function generateReport() {
    setIsGenerating(true);
    try {
      await fetch("/api/interview/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      router.refresh();
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <button
      className="rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
      disabled={isGenerating}
      type="button"
      onClick={generateReport}
    >
      {isGenerating ? "Generating..." : "Generate report"}
    </button>
  );
}
