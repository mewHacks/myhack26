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
