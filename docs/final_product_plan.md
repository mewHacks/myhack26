# Covalent — Product Plan
> MyHack 2026 | Sunway University | 16–17 May 2026

---

## 1. What We're Building

A centralised AI platform where founders, mentors, and investors live on one verified hub — and the AI matches, tracks, and improves every relationship across geographies and cohorts automatically.

**In one sentence:**
> Stop introducing the same people to each other every cohort. Let the AI remember, match, and improve — across every city, every programme, every time.

**Business model:** B2C2B
Individual users (founders, mentors, junior devs) join free. Organisations (investors) pay for deal flow access and ecosystem intelligence.

---

## 2. Context: What MYStartup.gov.my Does Today

MYStartup (MOSTI + Cradle Fund) is Malaysia's national startup directory. It lists startups, investors, programmes, and talent — but it stops there.

| What It Has | What It Lacks |
|---|---|
| Startup & investor directory | No AI matching — you search, nothing is recommended |
| Programme listings | No cross-programme visibility or assignment automation |
| Static ecosystem mapping | No relationship tracking or feedback loop |
| Talent job board | No persistent profile across programmes |

**Covalent is not replacing MYStartup. It is the intelligence and relationship layer MYStartup never built.**

---

## 3. The Three Pain Points

### Pain 1 — Geography
Ecosystem actors are geographically siloed. A founder in Sabah has no structured path to a mentor in KL. A programme admin in KL manually works a shortlist that excludes Penang by default. Access depends on physical proximity, not merit.

### Pain 2 — Decentralised
Founders, mentors, investors, and developers are scattered across WhatsApp groups, LinkedIn, spreadsheets, and siloed platforms. There is no single source of truth for who is in the ecosystem, what they do, or who they've worked with. Every programme operator rebuilds context from scratch.

### Pain 3 — No Persistent Records
When a cohort ends, everything disappears. Match history, mentor relationships, programme participation, and outcome data are lost. The next cohort starts from zero. A company that performed well in Programme A has no verified way to show that to Programme B. Institutional knowledge evaporates every cycle.

---

## 4. The Solution — Three Equal Pillars

| Pillar | What It Does |
|---|---|
| **Centralised Hub** | One verified persistent profile per actor, active across all programmes and locations |
| **AI Matching Engine** | Gemini 3.1 scores compatibility and generates a rationale card for every match |
| **Record Tracking + Feedback Loop** | Every engagement is logged, rated, and fed back into future matches |

---

## 5. User Types

### Founders & Startups
**Pain:** Start from zero every programme. No history follows them. Geography limits access.

**Gets:**
- Persistent company profile across all cohorts
- AI-matched mentor recommendations with rationale
- Programme history visible to investors
- Geo-agnostic notifications when relevant programmes open

**Flow:** `Build profile → AI suggests programmes + mentors → Connect → Engagement tracked → Profile strengthens`

---

### Mentors
**Pain:** Matched to wrong companies. No record of past impact. Invisible outside home city.

**Gets:**
- Verified expertise profile with availability flag
- AI-ranked company recommendations with rationale
- Full mentorship history and impact dashboard
- Match score updated after every engagement

**Flow:** `Build profile → AI surfaces best-fit founders → Accept match → Sessions logged → Feedback updates score`

---

### Investors
**Pain:** Deal flow blind spots outside KL. No standardised early-stage track record.

**Gets:**
- Deal flow feed filtered by thesis, stage, sector, geography
- Each startup shows verified programme history and mentor feedback scores — not just a pitch deck
- Watchlist with milestone notifications
- Direct connect request through platform

**Flow:** `Set investment thesis → AI surfaces matched companies → Review verified track record → Watchlist or connect`

---

---

## 6. Core Features

### 1. Unified Profile System
- One persistent, verified profile per actor across all programmes and geographies
- Profile strength score (0–100): completeness + verification + engagement history + feedback ratings
- Higher score = higher visibility in AI matches
- Actor types: Founder, Mentor, Investor

### 2. AI Matching Engine (Gemini 3.1)
- **Mentor ↔ Founder:** domain fit, stage fit, geography preference, past match outcomes
- **Founder ↔ Programme:** sector eligibility, stage, geography, past performance
- **Startup ↔ Investor:** thesis alignment, stage, traction signals
- Every match shows a **rationale card** — not just a name, but why
- Match scoring re-weights as feedback accumulates over time

**Rationale card example:**
```
Match Score: 87/100
✓ Mentor has 8 years fintech — company is B2B fintech at Seed
✓ Previously mentored 3 companies at similar stage, avg: 4.2/5
✓ Both KL-based, mentor is remote-friendly
✗ Limited ASEAN expansion experience (company's current goal)
```

### 3. Relationship Entity Tracker
Every connection is a structured persistent entity:
```
Relationship {
  type:           mentor:founder | investor:startup | company:programme
  status:         pending → active → completed → archived
  match_score:    float (at creation)
  feedback_score: float (post-engagement, both sides)
  reusable:       bool (flagged at cohort close if score ≥ 4.0)
  session_count:  int
  rationale:      string (Gemini-generated)
}
```
At cohort end, high-scoring relationships are flagged reusable and surfaced to admin for reactivation in the next cohort.

### 4. Feedback Loop
- Post-engagement rating (1–5) from both sides, 48hrs after session
- Ratings update both actors' profile strength scores
- Individual scores are private — only aggregates shown publicly
- Bad matches (< 2.5 combined) flagged for review
- System re-weights match dimensions based on outcome patterns over time

### 5. Geography Layer
- Location tag on every profile (city, state, country)
- Matching is **geo-agnostic by default** — distance never disqualifies
- Users can set "prefer local" — increases geography weight from 15% to 40%
- Programmes flagged as Remote-Friendly | Hybrid | Location-Specific
- Admin heat map: actor density by region, underserved areas highlighted

### 6. Junior / Entry-Level Track
- Self-identify as "Junior / First-time" at signup
- AI generates a structured pathway: community → programme → mentor type
- Companies flag "open to junior talent" — juniors surface as a distinct pool
- Prevents juniors from being outranked by senior profiles in the main matching pool

### 7. Investor Deal Flow Module
- Opt-in discoverability for startups
- Investor sees verified ecosystem data, not self-reported pitch decks
- Thesis filter set once — AI updates feed continuously
- Watchlist + milestone push notifications

---

## 7. Data Model

```
Actor {
  id, type [founder|mentor|investor]
  name, email, verified: bool
  location { city, state, country, remote_friendly }
  profile_strength_score: float
  tags: string[]          // sector, stage, skills, domain
}

Relationship {
  id, type, status
  actor_a_id, actor_b_id
  match_score, feedback_score_a, feedback_score_b
  rationale: string       // Gemini-generated
  session_count: int
  reusable: bool
  created_at, closed_at
}

Programme {
  id, name, owning_agency_id
  eligibility { sectors, stages, geography }
  status [draft|open|in_progress|completed]
  assigned_companies[], assigned_mentors[]
  milestones[]
}

MatchEvent {
  relationship_id
  gemini_rationale: string
  score_breakdown { domain_fit, stage_fit, geography, history }
  created_at
}

Milestone {
  programme_id, company_id
  title, due_date
  status [pending|submitted|approved|rejected]
  disbursement_eligible: bool
}
```

---

## 8. Tech Stack

| Layer | Technology |
|---|---|
| AI matching + rationale | Gemini 3.1 via Vertex AI |
| Multi-agent orchestration | Google ADK |
| Backend APIs | Cloud Run |
| Database | Firestore |
| Auth + hosting | Firebase |
| Frontend | React + Firebase Hosting |
| Feature vectors | Vertex AI Feature Store |

---

## 9. Agent Design (Google ADK)

Two core agents with distinct responsibilities and cross-agent communication:

### Matching Agent
**Trigger:** Profile created/updated, programme published, daily re-score, or request from Insights Agent
**Does:** 
- Constructs Gemini prompt with both profiles + scoring rubric.
- Receives scored output and stores MatchEvent.
- Surfaces rationale cards to users.
- **Communication:** Can ask the Insights Agent for historical performance data to refine match weights.

**Gemini prompt core:**
```
Score compatibility 0–100 across:
- Domain fit (30%), Stage fit (25%), Geography (15%), History (20%), Availability (10%)

Return JSON:
{ total_score, breakdown, rationale, flags }
```

### Insights Agent
**Trigger:** Admin requests report, weekly scheduled run, or request from Matching Agent
**Does:** 
- **Chart Generation:** Visualises ecosystem trends, match success rates, and regional density.
- **System Intelligence:** Aggregates outcomes, fill rates, and mentor utilisation.
- **Reporting:** Identifies underserved regions and produces exportable reports for investors/admins.
- **Communication:** Can ask the Matching Agent for real-time match projections to forecast programme success.

---

## 10. Hackathon Build Plan

### Build (demo tomorrow)

| Priority | Feature | Est. Time |
|---|---|---|
| 1 | Onboarding + profile for Founder + Mentor | 2–3 hrs |
| 2 | AI matching flow — Gemini returns top 3 matches with rationale card | 3–4 hrs |
| 3 | Relationship dashboard — status, match score, rationale inline | 1–2 hrs |
| 4 | Feedback widget — rate a match, watch profile score update live | 1 hr |

**Total: 6–9 hrs. Feasible overnight with 2–3 devs.**

### Pitch as roadmap (don't build)
- Investor deal flow module
- Geography heat map (live Insights Agent generated)
- Junior pathway track
- Milestone + grant disbursement tracker

### Demo script (2 min)
```
"Today, a founder in Sabah has no way to reach a mentor in KL.
 Programmes reset every cohort. Nothing is remembered."

[Show: profile creation]
"In Covalent, you join once. Your profile persists forever."

[Show: AI match with rationale card]
"Our Matching Agent doesn't just give you a name — it tells you why."

[Show: Insights dashboard]
"Our Insights Agent visualises the entire ecosystem, showing where the matches are working and where more support is needed."

[Show: feedback updating profile score]
"Every rating makes the system smarter, with agents collaborating to improve future outcomes."
```

---

## 11. Business Model — B2C2B

| Tier | Who | Price |
|---|---|---|
| Free | Founders, Mentors, Junior Devs | RM 0 |
| Investor Licence | VC firms, angel networks | RM 2,000–8,000/month |
| Corporate Licence (roadmap) | Corporate innovation arms | RM 10,000–25,000/month |

**Year 1 targets:** 500 free users · 3–5 investor licences · RM 200K ARR

---

## 12. Competitive Position

| Platform | Gap Covalent Fills |
|---|---|
| MYStartup.gov.my | Adds AI matching, relationship tracking, feedback loop |
| LinkedIn | No programme/cohort layer, no ecosystem memory |
| F6S | Applications only — no matching, no history, no feedback |
| Spreadsheets | Covalent replaces the entire manual workflow |

**Moat:** After 3 cohorts, match outcome data is an asset no late entrant can replicate.

---

*v2.0 — MyHack 2026 | 16–17 May 2026*
