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
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Profile Strength
        </span>
        <span className={`font-bold tabular-nums ${labelColors[strength.label]} ${isLg ? "text-2xl" : "text-base"}`}>
          {strength.total}
          <span className="text-xs font-normal text-muted">/100</span>
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-black/8">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColors[strength.label]}`}
          style={{ width: `${pct}%` }}
        />
      </div>

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
