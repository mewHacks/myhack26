import { NextRequest, NextResponse } from "next/server";

import { submitFeedback } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { side, rating, comment = "" } = await req.json();

  if (!side || rating == null) {
    return NextResponse.json({ error: "side and rating required" }, { status: 400 });
  }

  if (!["viewer", "matched"].includes(side)) {
    return NextResponse.json({ error: "side must be viewer or matched" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating must be 1–5" }, { status: 400 });
  }

  const rel = submitFeedback(id, side as "viewer" | "matched", {
    rating,
    comment,
    submittedAt: Date.now(),
  });

  if (!rel) {
    return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
  }

  return NextResponse.json({ relationship: rel });
}
