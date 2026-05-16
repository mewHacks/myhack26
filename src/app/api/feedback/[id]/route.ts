import { NextRequest, NextResponse } from "next/server";

import { findRelationship, submitFeedbackByActor } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { actorId, rating, comment = "" } = await req.json();

  if (!actorId || rating == null) {
    return NextResponse.json({ error: "actorId and rating required" }, { status: 400 });
  }

  const relationship = findRelationship(id);
  if (!relationship) {
    return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
  }

  if (actorId !== relationship.viewerId && actorId !== relationship.matchedId) {
    return NextResponse.json({ error: "actorId is not part of this relationship" }, { status: 403 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating must be 1–5" }, { status: 400 });
  }

  const rel = submitFeedbackByActor(id, actorId, {
    rating,
    comment,
    submittedAt: Date.now(),
  });

  return NextResponse.json({ relationship: rel });
}
