# Covalent

An AI-powered startup ecosystem matching platform connecting founders, mentors, and investors.

## What it does

- Browse and match with **founders**, **mentors**, and **investors**
- AI scoring engine ranks candidates by domain fit, stage, geography, history, and availability
- Feedback loop adjusts match weights over time
- Runs locally using Ollama for AI inference — no external API calls

## Prerequisites

- [Node.js](https://nodejs.org) 20+ or [Bun](https://bun.sh)
- [Ollama](https://ollama.com) installed and running

## Setup

**1. Install Ollama and pull the model**

```bash
ollama pull gemma3
ollama serve
```

**2. Install dependencies**

```bash
bun install
# or
npm install
```

**3. Configure environment (optional)**

The app works out of the box with Ollama defaults. To override:

```
OLLAMA_URL=http://localhost:11434   # default
OLLAMA_MODEL=gemma3                 # default
```

**4. Run the dev server**

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Test Ollama is working

```bash
curl http://localhost:11434/api/generate \
  -d '{"model":"gemma3","prompt":"hello","stream":false}' \
  -H "Content-Type: application/json"
```

You should get a JSON response with a `"response"` field.

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start dev server |
| `bun build` | Production build |
| `bun start` | Start production server |
| `bun test` | Run tests |
| `bun lint` | Lint code |

## Stack

- **Next.js 16** — framework
- **Tailwind CSS 4** — styling
- **Framer Motion** — animations
- **Ollama + Gemma 3** — local AI matching
- **Google ADK** — agent toolkit
