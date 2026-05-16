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
