import type { MatchResult } from "@/lib/match-engine";

type RationaleCardProps = {
  match: MatchResult;
};

const dimensions: { key: keyof MatchResult["breakdown"]; label: string; max: number }[] = [
  { key: "domain_fit", label: "Domain fit", max: 30 },
  { key: "stage_fit", label: "Stage fit", max: 25 },
  { key: "history", label: "Track record", max: 20 },
  { key: "geography", label: "Geography", max: 15 },
  { key: "availability", label: "Availability", max: 10 },
];

function ScoreBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-black/8">
        <div
          className="h-full rounded-full bg-foreground transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right text-[10px] font-semibold tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}

export function RationaleCard({ match }: RationaleCardProps) {
  return (
    <div className="w-72 space-y-3 rounded-2xl border border-white/70 bg-white/95 p-4 text-sm shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          AI Match Score
        </span>
        <span className="text-lg font-bold tabular-nums text-foreground">
          {match.score}
          <span className="text-xs font-medium text-muted">/100</span>
        </span>
      </div>

      <p className="leading-5 text-foreground">{match.rationale}</p>

      <div className="space-y-1.5 border-t border-line pt-3">
        {dimensions.map((d) => (
          <div key={d.key}>
            <div className="mb-0.5 flex justify-between text-[10px] text-muted">
              <span>{d.label}</span>
              <span className="text-[10px] text-muted">/{d.max}</span>
            </div>
            <ScoreBar value={match.breakdown[d.key]} max={d.max} />
          </div>
        ))}
      </div>

      {match.flags.length > 0 && (
        <ul className="space-y-0.5 border-t border-line pt-2">
          {match.flags.map((flag) => (
            <li key={flag} className="text-[11px] leading-5 text-muted">
              {flag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
