# Previous Winners — Google Hackathons

## Build With AI: Gemini Hackathon with Google DeepMind

### [Winner] Fishture
**Team:** Sia Yu Heng Jeff & Lim Chun Xin
**Links:** [Devpost](https://devpost.com/software/fishture-fish-aventure-ai) | [Live](http://fishture-kds000lio-jeff-sia-yu-hengs-projects.vercel.app/)

A smart, multimodal fishing companion app integrating real-time environmental data with AI to simplify angling. Eliminates manual catch logging via AI Vision for species/gear identification, cross-referenced with live tides, wind, and water data for personalized forecasts.

**Key Features:**
- Multimodal Catch Logging — AI Vision for species ID + voice-to-text for hands-free logging
- Context-Aware Fishing Guide — real-time chatbot with golden-window scores and gear advice
- Outdoor-First PWA — optimistic UI, high-contrast dashboards, offline data sync

**Tech Stack:**
- Model: Gemini API (vision, reasoning, structured JSON) via Vercel AI SDK
- Frontend: Next.js 14, TypeScript, Tailwind CSS, Shadcn UI, react-map-gl, Zustand
- Backend: Supabase (PostgreSQL + RLS), Next.js Route Handlers, Redis caching
- APIs: Stormglass.io, OpenWeatherMap, OpenTide, WorldTides
- Infra: Docker, GCP Cloud Run, Cloud Build CI/CD
- Dev Pipeline: Google AI Studio → Google Stitch → Antigravity

---

### [Winner] LoghatLingo
**Team:** Rizki Syaputra
**Links:** [Devpost](https://devpost.com/software/loghatlingo) | [Live](https://aistudio.google.com/apps/e08d4d1f-37b4-4fd7-89cc-2785776219b5?fullscreenApplet=true&showPreview=true&showAssistant=true)

Tackles Malaysia's healthcare dialect gap using Gemini to understand dialects with supportive context — ensuring rural elderly patients aren't marginalized by native tongue when seeking medical care.

**Key Features:**
- Dialect-to-Medical Translation — converts colloquial terms into formal BM/English medical terminology
- Jawi & Script OCR — transcribes and romanizes handwritten Jawi script
- Doctor's Empathy Guide — generates follow-up questions in patient's dialect

**Tech Stack:**
- Model: Gemini 3.0 Pro (multimodal inference, text + image)
- Dev: Google AI Studio for context engineering and system instructions
- Infra: Google Cloud Run (containerized, serverless)
- Prompting: Long context window + few-shot prompting for socio-linguistic nuances

---

### [Winner] Proposal of ASRS Simulation Guided by Gemini Robotics
**Team:** Jason Kung
**Links:** [Devpost](https://devpost.com/software/proposal-of-asrs-simulation-guided-by-gemini-robotics) | [Live](https://aistudio.google.com/apps/f0ef801d-1e9b-4675-9321-008d236958b2?showPreview=true&showAssistant=true)

Full-stack warehouse simulation where Gemini acts as the "brain" of an ASRS, translating natural language directives into precise robotic trajectories. Features LIDAR-based obstacle detection and a digital twin experience.

**Key Features:**
- Gemini-Driven Mission Planning — NL instruction → mission objective + spatial mapping
- Precision Pathfinding — modified A* with Manhattan distance, handling continuous coordinates
- Interactive Physics Simulation — battery, kinematics, LIDAR raycasting via Canvas

**Tech Stack:**
- Model: Google Gemini API (NLP parsing, spatial mission determination)
- Frontend: React, TypeScript, HTML5 Canvas API
- Navigation: Custom A* with decoupled physical/heuristic targets
- Simulation: Custom physics engine with smooth interpolation and sensor data

---

### [Winner] AstraGuard
**Team:** Lakxhana Selva Rajah & Aida N.
**Links:** [Devpost](https://devpost.com/software/astraguard-qg39up) | [GitHub](https://github.com/aida-nabila/AstraGuard)

AI-powered 3D platform visualizing satellites and space debris orbiting Earth with real-time collision risk prediction.

**Key Features:**
- Real-Time 3D Orbital Visualization — live satellite/debris data rendered interactively
- AI-Powered Collision Detection — trajectory analysis for proximity risk
- Space Traffic Alert System — high-risk zone identification with actionable alerts

**Tech Stack:**
- Data: CelesTrak TLE data
- Visualization: Custom 3D engine for large-scale orbital datasets
- Core: Orbital mechanics algorithms for real-time movement and collision prediction

---

### [Winner] Gutsy
**Team:** Lim Wei Kang & Fang Wei Lim
**Links:** [Devpost](https://devpost.com/software/gutsy-eating-with-a)

PWA that tracks food intake and provides gut health analysis — snap a photo of food/menu/label for instant personalized risk analysis (green/yellow/red) based on diagnosed conditions and triggers.

**Key Features:**
- AI Food Scanner — identifies ingredients, flags FODMAP groups, estimates nutrition
- Hidden Culprit Detection — AI finds foods that triggered flare-ups hours later
- Community Insights — connects "Gut Twins" with matching profiles

**Tech Stack:**
- Frontend: Next.js 16, React 19, App Router, Tailwind CSS 4, Lucide, Recharts
- Model: Gemini 2.5 Flash (real-time food image analysis, structured JSON, FODMAP)
- Model: Gemini 2.5 Pro with extended thinking (Hidden Culprit + Community Insights)
- Storage: Browser local storage (privacy-first, no cloud data)
- PWA: next-pwa for offline install

---

### [Community Award] BanjirSiaga
**Team:** Hasan Al-Talib & Aiman Zakuwan Ismail

A flood early-warning and community alert system leveraging AI and real-time data.

---

## KitaHack 2025

### [Champion] AI-Powered Recruitment Platform
**Team:** Ctrl + C Ctrl + V

AI-powered recruitment platform promoting fairness and impartiality in hiring.

**Key Highlights:**
- Resume anonymization and skill-based ranking for unbiased screening
- Personalized, anonymous AI-driven interviews with objective feedback
- Competed among 200+ teams, 600+ participants, 40+ Malaysian universities

---

### [1st Runner Up] MediMate
**Team:** Hokkien Mee is Red

AI-driven healthcare mobile app streamlining personal health management and diagnostic accuracy.

**Key Features:**
- Consultation Transcriber — AI captures and summarizes doctor-patient interactions
- Voice-Based Glucose Checker — Gemini-powered hands-free health guidance
- Smart Medication Management — vision-based prescription scanning + reminders

**Tech Stack:**
- Model: Gemini AI (health recommendations, voice interaction, medical reasoning)
- Frontend: React Native (cross-platform mobile)
- Backend: Python + Firebase (real-time sync, secure records)
- APIs: Google Vision (OCR), Google STT, ElevenLabs TTS, Google Fit, Google Maps

---

## KitaHack 2026

### [Champion] Eye-Blink Communication System for ALS & Stroke Patients
**Pitch:** [YouTube](https://www.youtube.com/watch?v=qNrSHKQegF4) | **GitHub:** [JinenO/IceBreakers](https://github.com/JinenO/IceBreakers)

Communication system for ALS/stroke patients using eye-blink detection to select daily needs through blinking.

**Key Highlights:**
- MediaPipe + Eye Aspect Ratio (EAR) for blink detection
- Blink-based selection for daily needs (food, water, media)
- Smart reminder system based on user behavior
- Inspired by *Tuesdays with Morrie*

---

### [1st Runner Up] iSuara
**GitHub:** [HongZhangLim/iSuara](https://github.com/HongZhangLim/iSuara)

First offline ML Bahasa Isyarat Malaysia interpreter for low-spec smartphones.

**Key Highlights:**
- Google LiteRT — 1.4x faster than legacy TFLite, 45+ FPS on an 8-year-old phone
- Custom Attention-Based BiLSTM — 94.93% accuracy, 22ms latency
- Velocity + acceleration features for fast signers
- Dynamic hand cropping + EMA smoothing for robust inference

---

### [3rd Place] TrustLens

Document trust verification platform rebuilding digital trust against AI-generated fraud.

**Key Highlights:**
- 4-layer deterministic pipeline: metadata, visual forensics, semantic issues, math/logic consistency
- Supports 11 document types, maps to 46 risk signals
- AI grounding + search verification
- Agentic assistants (Contract Guardian, Policy Advisor), RAG feedback, HITL expert review, Scam Alert Community

---

### [Special Award] OSCE Partner
**Team:** GoogleGaga

Real-time medical simulation helping medical students practice clinical exams with an AI standardised patient.

**Key Highlights:**
- Gemini 2.5 Flash Live API + Firebase + MediaPipe hand tracking
- Top 10 Finals out of 600+ teams
- Won Special Award (RM500)

---

## Pattern Analysis

| Theme | Seen In |
|-------|---------|
| Healthcare / accessibility | MediMate, Eye-Blink, OSCE, LoghatLingo |
| Real-time multimodal AI | Fishture, Gutsy, AstraGuard |
| Malaysia-specific problems | LoghatLingo, iSuara, BanjirSiaga |
| Gemini as core model | All Build With AI winners |
| GCP / Cloud Run deployment | Fishture, LoghatLingo |
| PWA / mobile-first | Fishture, Gutsy |
| Offline / low-resource | iSuara, Gutsy |
| Social/community impact | BanjirSiaga, Eye-Blink, iSuara |
