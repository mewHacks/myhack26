# AI Interview POC

This POC runs without a database. Sessions, transcripts, and reports are written to local JSON files under `data/ai-interviews/`.

## What LiveKit Adds

LiveKit is the realtime video room layer. In this POC it handles:

- Founder camera and microphone publishing
- A real WebRTC room per interview session
- Signed room tokens from `/api/interview/livekit-token`
- A future path for investor observers, recordings, or a real AI media participant

The AI interviewer avatar is still rendered in the frontend for speed. The founder joins the real LiveKit room, while the AI avatar tile is part of the room UI.

## Free Local LiveKit Setup

The app is configured for a local LiveKit server with the dev key in `livekit.dev.yaml`.

Use these env values in `.env.local`:

```bash
LIVEKIT_URL=ws://127.0.0.1:7880
NEXT_PUBLIC_LIVEKIT_URL=ws://127.0.0.1:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
```

Run LiveKit locally with Docker:

```bash
docker run --rm \
  -p 7880:7880 \
  -p 7881:7881 \
  -p 7882:7882/udp \
  -v "$PWD/livekit.dev.yaml:/livekit.yaml" \
  livekit/livekit-server \
  --config /livekit.yaml
```

Then run the app:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3001
```

Open:

```txt
http://127.0.0.1:3001/ai-interview
```

## Optional AI Provider

For free hosted AI question improvement/reporting, add:

```bash
GEMINI_API_KEY=your_key_here
```

Without `GEMINI_API_KEY`, the POC still works with deterministic fallback logic.

## Current Flow

1. Investor opens `/ai-interview`.
2. Investor chooses avatar identity and browser voice.
3. Investor writes or improves questions.
4. The investor flow ends once the required details are present.
5. App automatically creates a file-based session and LiveKit room name.
6. Founder opens `/interview/[sessionId]`.
7. Browser asks for camera and microphone permission on room entry.
8. The preview page shows only the founder video frame with mic/camera icon controls.
9. Founder clicks `Start`.
10. The AI avatar appears on the left and founder video remains on the right.
11. AI avatar asks the first question with browser TTS.
12. Browser STT keeps running while the interview is ongoing.
13. Founder submits the captured answer or typed correction.
14. Backend stores the transcript turn.
15. Local interview logic asks a follow-up or moves to the next planned question without calling Gemini.
16. Investor opens `/review/[sessionId]`.
17. Report is generated and stored as JSON.
