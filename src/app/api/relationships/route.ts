import { NextRequest, NextResponse } from "next/server";

import { findProfile } from "@/lib/profiles";
import { createRelationship, getRelationshipsForActor } from "@/lib/store";

export async function GET(req: NextRequest) {
  const viewerId = req.nextUrl.searchParams.get("viewerId");
  if (!viewerId) {
    return NextResponse.json({ error: "viewerId required" }, { status: 400 });
  }
  const relationships = getRelationshipsForActor(viewerId);
  return NextResponse.json({ relationships });
}

export async function POST(req: NextRequest) {
  const { viewerId, matchedId, matchScore, rationale, breakdown } = await req.json();

  if (!viewerId || !matchedId || matchScore == null) {
    return NextResponse.json({ error: "viewerId, matchedId, matchScore required" }, { status: 400 });
  }

  const viewer = findProfile(viewerId);
  const matched = findProfile(matchedId);
  if (!viewer || !matched) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const type =
    viewer.type === "mentor" || matched.type === "mentor"
      ? "mentor:founder"
      : "investor:founder";

  const rel = createRelationship({
    viewerId,
    matchedId,
    type: type as "mentor:founder" | "investor:founder" | "mentor:investor",
    status: "pending",
    matchScore,
    rationale: rationale ?? "",
    breakdown: breakdown ?? undefined,
  });

  return NextResponse.json({ relationship: rel });
}
