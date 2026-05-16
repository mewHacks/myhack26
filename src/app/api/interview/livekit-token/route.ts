import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function base64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signLiveKitToken(args: {
  apiKey: string;
  apiSecret: string;
  room: string;
  identity: string;
}) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      iss: args.apiKey,
      sub: args.identity,
      nbf: now - 10,
      exp: now + 60 * 60 * 2,
      video: {
        room: args.room,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
      },
    })
  );
  const signature = base64Url(
    createHmac("sha256", args.apiSecret).update(`${header}.${payload}`).digest()
  );
  return `${header}.${payload}.${signature}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const room = searchParams.get("room");
  const identity = searchParams.get("identity") || `founder-${Date.now()}`;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const url = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!room) {
    return NextResponse.json({ error: "room is required." }, { status: 400 });
  }

  if (!url) {
    return NextResponse.json({
      configured: false,
      reason: "Set LIVEKIT_URL to enable the real LiveKit room.",
    });
  }

  if (!apiKey || !apiSecret) {
    return NextResponse.json({
      configured: false,
      reason: "Set both LIVEKIT_API_KEY and LIVEKIT_API_SECRET to enable the real LiveKit room.",
    });
  }

  return NextResponse.json({
    configured: true,
    url,
    token: signLiveKitToken({ apiKey, apiSecret, room, identity }),
  });
}
