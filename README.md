# Covalent

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Gemini](https://img.shields.io/badge/Gemini-3%20Flash-4285F4?logo=google)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)](https://firebase.google.com/)

> **MyHack 2026 · Sunway University · 16–17 May 2026**

Covalent is the intelligence and relationship layer that Malaysia's startup ecosystem never had. Founders, mentors, and investors join once, build a verified persistent profile, and an AI matching engine powered by Gemini surfaces the right connections with a scored rationale card explaining exactly why. Every engagement is logged, rated, and fed back into the model so each cohort learns from the last.

**In one sentence:** Stop introducing the same people to each other every cohort. Let the AI remember, match, and improve — across every city, every programme, every time.

---

## Demo

[![Covalent Demo](https://img.youtube.com/vi/YCtZZjaG7ak/maxresdefault.jpg)](https://www.youtube.com/watch?v=YCtZZjaG7ak)

> [Watch the Covalent Demo on YouTube](https://www.youtube.com/watch?v=YCtZZjaG7ak)

<!-- Add screenshots here -->

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Repo Structure](#repo-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)

---

## Overview

Malaysia's startup ecosystem suffers from three compounding failures:

- **Geography** — a founder in Sabah has no structured path to a mentor in KL; access depends on physical proximity, not merit
- **Fragmentation** — founders, mentors, investors, and developers are scattered across WhatsApp groups, LinkedIn, and siloed platforms with no single source of truth
- **Institutional amnesia** — when a cohort ends, match history, mentor relationships, and outcome data disappear; the next cohort starts from zero

Covalent is not replacing MYStartup — it is the intelligence and relationship layer MYStartup never built.

| What MYStartup Has | What Covalent Adds |
|---|---|
| Startup & investor directory | AI matching with scored rationale cards |
| Programme listings | Cross-programme relationship memory |
| Static ecosystem mapping | Feedback-driven weight engine that improves over time |
| Talent job board | Persistent verified profiles across all cohorts |

---

## Features

### Core Platform

| Feature | Description |
|---|---|
| **Unified Profile System** | One verified persistent profile per actor (Founder, Mentor, Investor) active across all programmes and geographies |
| **AI Matching Engine** | Gemini 3 Flash scores compatibility 0–100 across 5 weighted dimensions and returns a rationale card for every match |
| **Rationale Cards** | Every match shows domain fit, stage fit, geography, history, and availability breakdown — not just a name, but why |
| **Relationship Dashboard** | Structured relationship entities with full lifecycle tracking: pending → active → completed |
| **Feedback Loop** | Bilateral 1–5 ratings from both sides post-engagement; updates profile strength and re-weights future matches |
| **Profile Strength Score** | 0–100 score across completeness (30pts), engagement depth (40pts), and feedback received (30pts) |
| **Deterministic Fallback** | If Gemini is unreachable the app never shows blank results — a deterministic scoring engine takes over instantly |

### AI Interview (Investor Flow)

| Feature | Description |
|---|---|
| **Interview Builder** | Investors configure an AI avatar, voice, and custom question set with Gemini-assisted question improvement |
| **Founder Interview Room** | Camera/microphone room with real-time transcript capture and AI evaluation |
| **Investor Review Report** | Gemini-generated evaluation report accessible to the investor after each session |
| **LiveKit Integration** | Real-time room transport via LiveKit Cloud when configured; falls back to browser speech APIs |

### Browse & Discovery

| Feature | Description |
|---|---|
| **MYStartup Browse** | Role-specific discovery pages for startups, mentors, and investors |
| **Opportunity History Tree** | D3-based tree visualisation of a startup's programme participation history |
| **Geography-Agnostic Matching** | Distance never disqualifies a match; "prefer local" increases geography weight from 15% to 40% |

### zkSafe — Companion Browser Extension

Startup founders and investors click dozens of external links through Covalent — programme portals, funding applications, partner sites, and investor decks. zkSafe is a companion browser extension that acts as a trust verification layer before any credentials or wallet connections are made on those external pages.

| Feature | Description |
|---|---|
| **Page Safety Scan** | Analyses any web page for 15 threat categories before the user interacts with it |
| **TEE Attestation** | Scoring runs inside a Google Confidential VM (Trusted Execution Environment) — the result is hardware-attested, not just software-checked |
| **zkTLS Proof** | Every scan produces a cryptographic proof via Reclaim Protocol with a verifiable signature and TLS handshake record |
| **Threat Dashboard** | Full scan history with per-domain risk scores, zkTLS signatures, and exportable QR proof cards |
| **Freemium Model** | Free tier covers standard scans; premium unlocks advanced threat checks via Stripe |

**Threat checks covered:**

| Check | Weight |
|---|---|
| Credential harvest absent | 16 |
| Wallet drain prompt absent | 16 |
| Off-origin form action absent | 14 |
| Clipboard key capture absent | 12 |
| Domain lookalike absent | 12 |
| Hidden capture fields absent | 10 |
| Suspicious download prompt absent | 10 |
| Obfuscated scripts absent | 8 |
| Brand impersonation | 8 |
| Suspicious script sources absent | 8 |
| PII request safe | 8 |
| Redirect chain safe | 6 |
| zkTLS proof valid | 6 |
| TEE attestation valid | 6 |
| Reclaim proof valid | 4 |

**Where it lives:** `zksafe-extension/` — a standalone Next.js app packaged as a browser extension. Not integrated into the main Covalent web app; deployed and used independently by ecosystem participants as a security companion.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, Framer Motion |
| AI Matching | Gemini 3 Flash via REST API |
| AI Fallback | Deterministic scoring engine (in-app, zero latency) |
| AI Interview | Gemini (question improvement + evaluation), LiveKit Cloud (media transport) |
| Auth | Firebase Auth (Google Sign-In) |
| State / DB (prototype) | In-memory server store, seeded on startup |
| State / DB (production path) | Firestore |
| Visualisation | D3 (opportunity history tree), cobe (WebGL globe) |
| Testing | Node.js built-in test runner with jiti |
| Deployment | Google Compute Engine + Cloudflare Tunnel / Cloud Run |

---

## Architecture

```
Browser
  │
  ├─ REST requests  →  Next.js API Routes  →  lib/match-engine  →  Gemini API
  │                                        →  lib/store         →  In-memory / Firestore
  │                                        →  lib/weight-engine →  Feedback-adjusted weights
  │
  └─ Auth           →  Firebase Auth       →  Google Sign-In
```

### Key Design Decisions

- **Dual AI provider** — `GEMINI_API_KEY` routes to Gemini 3 Flash; absent key routes to Ollama; both absent falls back to deterministic scoring. The app never returns empty results.
- **Feedback-driven weight engine** — after ≥2 completed relationships, the weight engine analyses which scoring dimensions correlated with high ratings (≥4.0/5) and adjusts multipliers (0.85× – 1.2×) per actor for future matches.
- **Profile strength as a moat** — higher strength score = higher visibility in AI match pool, incentivising real engagement and data quality over time.
- **Relationship entity lifecycle** — every connection is a structured persistent entity with status (`pending → active → completed`), bilateral feedback, and a `reusable` flag for high-scoring relationships to carry forward to the next cohort.

---

## Repo Structure

```
myhack26/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── match/              POST /api/match — AI matching endpoint
│   │   │   ├── feedback/[id]/      POST /api/feedback/:id — bilateral rating submission
│   │   │   ├── relationships/      GET/POST /api/relationships — relationship CRUD
│   │   │   ├── profile-strength/   GET /api/profile-strength/:id — strength score
│   │   │   └── interview/          Interview session, answer, report, avatar, token APIs
│   │   ├── dashboard/              Relationship dashboard page
│   │   ├── startup/                Founder audience page
│   │   ├── mentors/                Mentor audience page
│   │   ├── investors/              Investor audience page
│   │   ├── profiles/[slug]/        Dynamic actor profile page
│   │   ├── opportunities/[slug]/   Dynamic opportunity detail page
│   │   ├── ai-interview/           Investor AI interview builder
│   │   ├── interview/[id]/         Founder interview room
│   │   └── review/[id]/            Investor review/report page
│   │
│   ├── components/
│   │   ├── ai-match-card.tsx       Match result card with score + rationale
│   │   ├── rationale-card.tsx      Dimension breakdown display
│   │   ├── relationship-dashboard.tsx  Full relationship lifecycle view
│   │   ├── relationship-card.tsx   Individual relationship card
│   │   ├── feedback-widget.tsx     1–5 star rating + comment submission
│   │   ├── profile-strength-badge.tsx  Strength score badge (New/Growing/Established/Top)
│   │   ├── opportunity-history-tree.tsx  D3 programme history graph
│   │   └── ui/                     Nav, globe, icons
│   │
│   └── lib/
│       ├── match-engine.ts         Gemini + deterministic scoring, prompt builder
│       ├── weight-engine.ts        Feedback-driven dimension weight adjustment
│       ├── strength-calculator.ts  Profile strength scoring (0–100)
│       ├── store.ts                In-memory relationship store + feedback lifecycle
│       ├── profiles.ts             Actor types + mock seed profiles
│       └── firebase.ts             Firebase app + auth initialisation
│
├── tests/
│   └── match-engine.test.ts        Node test runner integration tests
├── docs/
│   └── final_product_plan.md       Canonical product plan and business model
└── data/
    └── ai-interviews/              Local interview sessions, transcripts, reports (demo only)
```

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/mewHacks/myhack26.git
cd myhack26

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in at minimum: GEMINI_API_KEY and Firebase keys

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app works without any environment variables — Gemini falls back to deterministic matching, and Firebase Auth is optional.

---

## Environment Variables

Create `.env.local` in the project root. Never commit real secrets.

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | AI features | Google Gemini API key — get one free at [aistudio.google.com](https://aistudio.google.com) |
| `GEMINI_MODEL` | AI features | Model name (default: `gemini-3-flash-preview`) |
| `OLLAMA_URL` | Local AI fallback | Ollama server URL (default: `http://localhost:11434`) |
| `OLLAMA_MODEL` | Local AI fallback | Ollama model name (default: `gemma3`) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Auth | Firebase web app API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Auth | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Auth | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Auth | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Auth | Firebase messaging sender ID |
| `LIVEKIT_URL` | AI Interview | LiveKit Cloud WebSocket URL |
| `LIVEKIT_API_KEY` | AI Interview | LiveKit API key |
| `LIVEKIT_API_SECRET` | AI Interview | LiveKit API secret |
| `POLLINATIONS_API_KEY` | AI Interview | Avatar image generation (falls back to uploaded image if absent) |

---

## API Reference

| Route | Method | Description |
|---|---|---|
| `/api/match` | POST | Run AI match engine for a viewer; returns top 3 matches with rationale |
| `/api/feedback/[id]` | POST | Submit 1–5 rating for a relationship; auto-completes when both sides rate |
| `/api/relationships` | GET | List relationships for an actor |
| `/api/relationships` | POST | Create a new relationship from a match result |
| `/api/profile-strength/[id]` | GET | Return computed strength score for an actor |
| `/api/interview/sessions` | GET | List local interview sessions |
| `/api/interview/sessions` | POST | Create an interview session |
| `/api/interview/sessions/[id]` | GET | Read one session with transcript and evaluation |
| `/api/interview/answer` | POST | Append founder answer and return next interview move |
| `/api/interview/finish` | POST | Generate or retrieve interview evaluation |
| `/api/interview/avatar-generate` | POST | Generate avatar image from uploaded photo |
| `/api/interview/livekit-token` | GET | Generate LiveKit room token |
| `/api/interview/questions/improve` | POST | Improve interview questions with Gemini |
| `/api/health/ai` | GET | Check Gemini availability |

---

## Testing

```bash
npm test
```

Tests use Node.js built-in test runner with jiti for TypeScript. Test file: `tests/match-engine.test.ts`.

| What is tested |
|---|
| Deterministic matcher returns ranked compatible candidates |
| Existing relationships are excluded from new match candidates |
| Weight boosts increase dimension scores without pushing total above 100 |

---

## Deployment

### Google Compute Engine (Recommended for demo)

Full step-by-step: see [deploy/CLOUD-RUN.md](deploy/CLOUD-RUN.md) for Cloud Run, or follow below for GCE.

```bash
# On your VM (Debian 12)
sudo apt install -y nodejs git nginx
git clone https://github.com/mewHacks/myhack26.git && cd myhack26
npm install && npm run build
npm install -g pm2
pm2 start npm --name "covalent" -- start
pm2 save && pm2 startup
```

Serve on port 80 with Nginx proxy, then add free HTTPS via Cloudflare Tunnel:

```bash
cloudflared tunnel create covalent
cloudflared tunnel route dns covalent your-domain.com
sudo cloudflared service install && sudo systemctl start cloudflared
```

### Cloud Run (LoRA branch)

```bash
# Deploy Ollama + fine-tuned Gemma LoRA adapter
./scripts/deploy-all.sh /path/to/lora-adapter

# Or deploy without LoRA (uses Gemini)
./scripts/deploy-all.sh
```

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Matches show scores but no rationale text | `GEMINI_API_KEY` not set | Add key to `.env.local` — deterministic fallback works but produces template rationale |
| Google Sign-In popup blocked | Domain not in Firebase authorized list | Firebase Console → Authentication → Settings → Authorized domains → add your domain/IP |
| `npm run build` crashes on VM | Out of memory (e2-micro has 1 GB) | Add 2 GB swap: `sudo fallocate -l 2G /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile` |
| SSH times out during `npm run build` | Connection dropped mid-build | Use `tmux new -s deploy` before running build; reconnect with `tmux attach -t deploy` |
| Cloudflared service not found | Config in wrong directory | Copy config to `/etc/cloudflared/` — system service requires config there, not `~/.cloudflared/` |
| AI interview avatar returns 500 | `POLLINATIONS_API_KEY` missing | Set the key or leave it unset — the UI falls back to the uploaded image automatically |
| LiveKit room not connecting | LiveKit env vars missing | Set `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` — falls back to browser camera preview |

---

## Roadmap

- Firestore persistence (replace in-memory store)
- Profile creation onboarding flow (AI-assisted questionnaire → profile)
- Investor deal flow module with thesis filter and watchlist
- Geography heat map powered by Insights Agent (Google ADK)
- Junior / entry-level talent track
- Milestone + grant disbursement tracker
- Auth middleware on all API routes (production hardening)
- Deployed LiveKit agent integration for full AI interview loop

---

## Business Model

| Tier | Who | Price |
|---|---|---|
| Free | Founders, Mentors, Junior Devs | RM 0 |
| Investor Licence | VC firms, angel networks | RM 2,000–8,000/month |
| Corporate Licence *(roadmap)* | Corporate innovation arms | RM 10,000–25,000/month |

Year 1 target: 500 free users · 3–5 investor licences · RM 200K ARR.

**Moat:** After 3 cohorts, match outcome data is an asset no late entrant can replicate.

---

## License

[MIT](LICENSE) — MyHack 2026
