import { NextRequest, NextResponse } from "next/server";

import { getMatches } from "@/lib/match-engine";
import { findProfile, getCandidatesFor } from "@/lib/profiles";

export async function POST(req: NextRequest) {
  const { viewerId } = await req.json();

  if (!viewerId) {
    return NextResponse.json({ error: "viewerId required" }, { status: 400 });
  }

  const viewer = findProfile(viewerId);
  if (!viewer) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const candidates = getCandidatesFor(viewer);

  try {
    const matches = await getMatches(viewer, candidates);
    return NextResponse.json({ matches });
  } catch (err) {
    console.error("Match engine error:", err);
    return NextResponse.json({ error: "Matching failed" }, { status: 500 });
  }
}
