import { NextRequest, NextResponse } from "next/server";

import { findProfile } from "@/lib/profiles";
import { computeStrength } from "@/lib/strength-calculator";
import { getRelationships } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const profile = findProfile(id);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const allRelationships = getRelationships();
  const strength = computeStrength(profile, allRelationships);

  return NextResponse.json({ strength });
}
