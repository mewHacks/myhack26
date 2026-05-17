# Covalent

Covalent is an AI-assisted memory and relationship tracking layer for startup ecosystems. It helps founders, mentors, and investors keep track of people, conversations, context, feedback, and next steps, with AI built on top to surface relevant history, suggest useful follow-ups, and support structured investor interviews.

## Core Features

- Track startup, mentor, and investor relationships over time.
- Preserve interaction memory, feedback, reusable context, and connection history.
- Surface relevant people and next steps from stored ecosystem memory.
- Use AI to explain recommendations, summarize context, and support follow-up decisions.
- Let investors configure an AI interview avatar, voice, and question set.
- Run founder interviews with camera/microphone preview, transcript capture, and AI review reports.
- Generate LiveKit room tokens for real-time interview rooms when LiveKit is configured.
- Fall back to local camera preview and browser speech APIs when LiveKit or AI providers are unavailable.

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Firebase client auth integration
- Gemini API for AI recommendations, question improvement, and report generation when configured
- Ollama/Gemma fallback support in recommendation code paths
- LiveKit Cloud/LiveKit rooms for interview media transport when configured
- Browser `SpeechRecognition` and `speechSynthesis` for the interview POC voice loop
- File-backed local interview store under `data/ai-interviews` for demo persistence

## Important POC Caveats

The AI interview implementation is currently a hackathon/POC implementation, not production hardened.

- Interview sessions, transcripts, and reports are stored on local disk in `data/ai-interviews`.
- The interview APIs do not enforce authentication or authorization yet.
- The LiveKit token route can mint room tokens if credentials are configured; protect it before production use.
- Uploaded avatar images can be stored as base64 data URLs in session files.
- The founder interview UI loads LiveKit client code from a CDN rather than a pinned package dependency.
- The browser speech loop is not the same as the deployed LiveKit Cloud agent yet.
- Avatar image generation currently expects `POLLINATIONS_API_KEY`; without it, the UI falls back to the uploaded image as the avatar head.

Before merging this branch into production, replace local file storage with a real database/storage backend, add auth checks, restrict LiveKit token grants, validate uploaded image size/type, and wire the frontend to the deployed LiveKit agent flow.

## Repository Layout

```text
src/app/
  ai-interview/                 Investor AI interview setup page
  interview/[id]/               Founder interview room
  review/[id]/                  Investor review/report page
  api/interview/                Interview session, answer, report, avatar, and token APIs
  api/match/                    AI recommendation endpoint
  api/relationships/            Relationship memory endpoint
  api/feedback/[id]/            Feedback submission endpoint
  api/profile-strength/[id]/    Profile strength endpoint

src/components/
  ai-interview/                 Interview builder, founder room, and review actions
  relationship-dashboard.tsx    Relationship memory dashboard UI
  opportunity-detail-view.tsx   Opportunity detail UI
  opportunity-history-tree.tsx  Relationship/history graph UI

src/lib/
  interview-ai.ts               Question improvement and interview evaluation helpers
  interview-store.ts            Local file-backed interview store
  match-engine.ts               AI and deterministic recommendation logic
  weight-engine.ts              Feedback-based recommendation weight adjustment
  store.ts                      In-memory relationship and feedback demo store
  profiles.ts                   Mock founder, mentor, and investor profiles

data/ai-interviews/             Demo interview sessions, transcripts, and reports
```

## Prerequisites

- Bun 1.3+ recommended
- Node.js 20+ if using npm instead of Bun
- Optional: Ollama for local recommendation fallback
- Optional: Gemini API key for AI recommendations, question improvement, and report generation
- Optional: Pollinations API key for avatar image edit generation
- Optional: LiveKit Cloud project and API credentials for real-time rooms

## Environment Variables

Create `.env.local` in the project root. Do not commit real secrets.

```bash
# Gemini AI flows
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash

# Optional local Ollama fallback for recommendations
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gemma3

# LiveKit room token generation
LIVEKIT_URL=wss://your-project.livekit.cloud
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# Avatar generation. If omitted, uploaded-image fallback is used.
POLLINATIONS_API_KEY=your_pollinations_key

# Firebase client auth, if sign-in is used
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
```

## Setup

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun run dev
```

Open the app:

```text
http://localhost:3000
```

Open the AI interview builder directly:

```text
http://localhost:3000/ai-interview
```

## AI Interview Flow

1. Visit `/ai-interview`.
2. Enter the investor name.
3. Upload, drag, or paste an investor photo.
4. If `POLLINATIONS_API_KEY` is configured, the app attempts to generate a polished avatar image.
5. If avatar generation fails, the uploaded image is used as the avatar head fallback.
6. Choose a browser voice if available.
7. Add, edit, delete, or AI-improve founder interview questions.
8. Click `Done` to save the interview preferences.
9. The app creates an interview session and routes to `/interview/[id]`.
10. The founder joins, grants camera/microphone permission, and answers questions.
11. Answers are appended to the transcript through `/api/interview/answer`.
12. Ending the interview generates or retrieves an evaluation through `/api/interview/finish`.
13. The investor can review the report at `/review/[id]`.

## LiveKit Integration

The app includes a LiveKit token endpoint at:

```text
/api/interview/livekit-token?room=<roomName>&identity=<participantIdentity>
```

When `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` are configured, this endpoint returns a room token with publish and subscribe grants. The founder interview page uses that token to connect and publish local camera/audio tracks.

If LiveKit is not configured, the founder room falls back to local browser camera/microphone preview.

### Deployed LiveKit Agent

A LiveKit Cloud agent was deployed separately with this dispatch name:

```text
covalent-interview-agent
```

The current frontend POC does not yet dispatch conversations to this agent. To complete the production LiveKit flow, update token generation to include agent dispatch for `covalent-interview-agent` and replace the browser-only speech loop with LiveKit Agent session handling.

## API Routes

| Route | Method | Purpose |
|---|---:|---|
| `/api/interview/sessions` | `GET` | List local interview sessions |
| `/api/interview/sessions` | `POST` | Create an interview session |
| `/api/interview/sessions/[id]` | `GET` | Read one session, transcript, and evaluation |
| `/api/interview/answer` | `POST` | Append founder answer and return next interview move |
| `/api/interview/finish` | `POST` | Generate or retrieve interview evaluation |
| `/api/interview/avatar-generate` | `POST` | Generate avatar image from uploaded photo when provider key exists |
| `/api/interview/livekit-token` | `GET` | Generate LiveKit room token when LiveKit env vars exist |
| `/api/interview/questions/improve` | `POST` | Improve interview questions with Gemini or fallback logic |
| `/api/match` | `POST` | Generate AI recommendations from relationship context |
| `/api/relationships` | `GET` | Return demo relationship memory data |
| `/api/feedback/[id]` | `POST` | Submit relationship feedback |
| `/api/profile-strength/[id]` | `GET` | Return profile strength calculation |
| `/api/health/ai` | `GET` | Check Gemini configuration/availability |

## Useful Pages

| Page | Purpose |
|---|---|
| `/` | Landing page |
| `/startup` | Startup-facing browse page |
| `/mentors` | Mentor-facing browse page |
| `/investors` | Investor-facing browse page |
| `/dashboard` | Relationship dashboard |
| `/opportunities/[slug]` | Opportunity detail page |
| `/profiles/[slug]` | Profile detail page |
| `/ai-interview` | Investor AI interview setup |
| `/interview/[id]` | Founder interview room |
| `/review/[id]` | Investor review/report page |

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the Next.js development server |
| `bun run build` | Build the production app |
| `bun run start` | Start the production server after build |
| `bun run lint` | Run ESLint |
| `bun run test` | Run Node test files under `tests/*.test.ts` |
| `bun run deploy:cloud-run` | Run the Cloud Run deployment script |
| `bun run seed:firestore` | Seed Firestore demo data when script and credentials are available |

## Verification

Recommended checks before opening a PR:

```bash
bun install
bun run lint
bun run build
```

The current interview branch build can emit a Turbopack warning related to file tracing through `src/lib/interview-store.ts`. The build still completes, but this warning is another signal that the file-backed POC store should be replaced before production deployment.

## Local Data

Interview sessions are stored under:

```text
data/ai-interviews/sessions.json
data/ai-interviews/transcripts/*.json
data/ai-interviews/reports/*.json
```

These files are useful for demos, but they can contain founder answers and uploaded avatar data. Treat them as sensitive. Do not commit real interview data.

## Production Hardening Checklist

- Add authentication to all `/api/interview/*` routes.
- Add authorization so founders/investors can only access their own sessions.
- Replace `data/ai-interviews` file storage with Firestore, Supabase, or another database.
- Store uploaded avatars in object storage instead of inline base64 session JSON.
- Validate upload MIME type and max file size.
- Add rate limiting to AI, avatar, and LiveKit token routes.
- Restrict LiveKit token TTL and grants by authenticated user/session.
- Dispatch the deployed `covalent-interview-agent` from token generation or frontend session setup.
- Install and import `livekit-client` as a dependency instead of loading it from CDN.
- Rotate any demo API keys that were shared during development.
- Remove generated demo interview data from commits unless it is intentionally seeded fixture data.

## Troubleshooting

If `bun run dev` says `Script not found "dev"`, run it from the project root, not the parent directory:

```bash
cd /Users/wy/Documents/Covalent-myhack/myhack26-interview-merge
bun run dev
```

If `/api/interview/avatar-generate` returns `500`, set `POLLINATIONS_API_KEY` or use the uploaded-image fallback.

If the founder room says LiveKit is not configured, set `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` in `.env.local` and restart the dev server.

If Gemini routes fail, confirm `GEMINI_API_KEY` is set and the selected `GEMINI_MODEL` is available for the key.
