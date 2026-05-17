# zkSafe Anti-Fraud Chrome Extension Checklist

## 1) Product Scope Lock
- [ ] Finalize MVP surfaces: Chrome extension popup + current tab analysis only
- [ ] Confirm alert policy: `High only` or `Medium + High`
- [ ] Freeze supported languages: BI, BM, BC
- [ ] Define "threat detected" as matrix threshold (checked items count)

## 2) UX/UI Design (Google-only)
- [ ] Create design tokens with Google palette only (`#1A73E8`, `#34A853`, `#FBBC05`, `#EA4335`, neutrals)
- [ ] Typography: Google Sans/Roboto, elderly-first scale (18px+ body, large CTAs)
- [ ] Build screens:
  - [ ] Home (`Check Page` big button)
  - [ ] Result Safe
  - [ ] Result Caution
  - [ ] Result Danger (threat list)
  - [ ] TEE status badge (`TEE verified` / `TEE unavailable`)
- [ ] Accessibility pass: contrast, tap targets, simple wording

## 3) Risk Matrix Definition (No Numeric Score)
- [ ] Define initial threat checks (6-8 items)
- [ ] Set banding rule:
  - [ ] Low = 0-1 checks
  - [ ] Medium = 2-3 checks
  - [ ] High = 4+
- [ ] Define output schema: `checked`, `reason`, `evidence_type`, `recommended_action`
- [ ] Write plain-language BI/BM/BC copies for each threat row

## 4) Extension Architecture (MV3 + Next.js SSG)
- [ ] Static export config for Next.js (`output: 'export'`)
- [ ] MV3 manifest with:
  - [ ] popup entry
  - [ ] service worker
  - [ ] content scripts
  - [ ] minimum permissions
- [ ] Content script plan: selective DOM extraction only
- [ ] Service worker plan: orchestrate analysis + threat event handling

## 5) Threat Alert Flow
- [ ] Define trigger event from matrix band (Medium/High policy)
- [ ] Alarm architecture for MV3 (offscreen/audio-compatible flow)
- [ ] Auto-visibility behavior:
  - [ ] show danger UI immediately
  - [ ] include threat checklist and "what to do now"
- [ ] Cooldown/debounce to avoid alarm spam on repeated checks

## 6) Fast AI Inference (Gemma 3)
- [ ] Use Gemma 3 as primary model
- [ ] Keep request payload minimal and structured
- [ ] Enforce strict JSON output for deterministic parsing
- [ ] Add timeout fallback to rules-only matrix
- [ ] Add latency SLO (e.g., target <2s response)

## 7) TEE Confidential Compute (Mandatory)
- [ ] Deploy inference API on Cloud Run Confidential
- [ ] Enable attestation verification path
- [ ] Accept AI verdict only when TEE checks pass
- [ ] If TEE unavailable: return rules-only + clear status flag
- [ ] Log attestation outcomes without storing sensitive page data

## 8) Privacy + Security Controls
- [ ] Local redaction before upload (password/OTP/token/PII stripping)
- [ ] Data minimization policy (features/snippets only, no full DOM default)
- [ ] Request integrity: nonce + timestamp + replay protection
- [ ] Optional zkTLS/Reclaim proof verification pipeline
- [ ] Consent and disclosure text for extension users

## 9) QA + Validation
- [ ] Unit tests for matrix rule engine
- [ ] Integration tests: content script -> backend -> popup states
- [ ] Alarm tests: trigger, cooldown, no false repeat
- [ ] Multilingual copy validation with elderly readability checks
- [ ] False-positive tuning against sample phishing/legit pages

## 10) Release Readiness
- [ ] Chrome Web Store policy checklist
- [ ] Permission minimization review
- [ ] Security review (threat model + abuse scenarios)
- [ ] Pilot rollout plan and rollback switch
- [ ] Monitoring dashboard for latency + detection quality

## Recommended Build Order
1. UI design tokens + screens
2. Matrix schema + local rules
3. Extension wiring (MV3 + SSG)
4. Alarm + danger state UX
5. Gemma 3 backend
6. TEE attestation gating
7. Privacy/proof integration
8. QA + pilot
