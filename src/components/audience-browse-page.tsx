"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { BrandMark } from "@/components/brand-mark";
import { OpportunityCard } from "@/components/opportunity-card";
import { HeaderActions } from "@/components/ui/header-actions";
import NavHeader from "@/components/ui/nav-header";
import {
  getOpportunitySlug,
  headerLinks,
  type AudienceSlug,
  type BrowseOpportunity,
  type BrowsePageTheme,
} from "@/lib/browse-page-content";

const aiSuggestionHeadings: Record<AudienceSlug, string> = {
  startup: "AI suggestions for mentors, programmes and investors",
  mentors: "AI suggestions for startups and programmes",
  investors: "AI suggested startups to invest in",
};

type AiCalculation = { score: number; factors: { label: string; value: number }[] };

const aiCalculations: Record<AudienceSlug, Record<string, AiCalculation>> = {
  startup: Object.fromEntries([
    [
      "James Foo",
      {
        score: 93,
        factors: [
          { label: "Mentor fit", value: 38 },
          { label: "Fundraising need", value: 31 },
          { label: "Fintech overlap", value: 24 },
        ],
      },
    ],
    [
      "MYStartup VentureX",
      {
        score: 89,
        factors: [
          { label: "Programme fit", value: 35 },
          { label: "Growth stage", value: 30 },
          { label: "Funding path", value: 24 },
        ],
      },
    ],
    [
      "Private Funding Firms",
      {
        score: 86,
        factors: [
          { label: "Investor match", value: 34 },
          { label: "Capital access", value: 29 },
          { label: "Sector breadth", value: 23 },
        ],
      },
    ],
  ]),
  mentors: Object.fromEntries([
    [
      "SkillLoop",
      {
        score: 92,
        factors: [
          { label: "Mentor impact", value: 37 },
          { label: "Edtech overlap", value: 31 },
          { label: "Growth gap", value: 24 },
        ],
      },
    ],
    [
      "PayChain",
      {
        score: 88,
        factors: [
          { label: "Fundraise coaching", value: 35 },
          { label: "B2B traction", value: 30 },
          { label: "Regional need", value: 23 },
        ],
      },
    ],
    [
      "Talent Programmes",
      {
        score: 85,
        factors: [
          { label: "Programme match", value: 35 },
          { label: "Event access", value: 27 },
          { label: "Ecosystem pull", value: 23 },
        ],
      },
    ],
  ]),
  investors: Object.fromEntries([
    [
      "PayChain",
      {
        score: 94,
        factors: [
          { label: "Revenue traction", value: 39 },
          { label: "Fintech thesis", value: 32 },
          { label: "SEA scale", value: 23 },
        ],
      },
    ],
    [
      "MedSync",
      {
        score: 90,
        factors: [
          { label: "AI thesis", value: 35 },
          { label: "Healthtech gap", value: 31 },
          { label: "Pilot signal", value: 24 },
        ],
      },
    ],
    [
      "SkillLoop",
      {
        score: 87,
        factors: [
          { label: "User traction", value: 34 },
          { label: "Edtech market", value: 29 },
          { label: "AI roadmap", value: 24 },
        ],
      },
    ],
  ]),
};

const aiCalculationFallback = {
  score: 82,
  factors: [
    { label: "Resource fit", value: 34 },
    { label: "Timing", value: 26 },
    { label: "Ecosystem value", value: 22 },
  ],
};

type AudienceBrowsePageProps = {
  audience: AudienceSlug;
  opportunities: BrowseOpportunity[];
  theme: BrowsePageTheme;
};

type StartupPerson = {
  name: string;
  relationship: string;
};

type StartupBacker = {
  name: string;
  type: string;
};

type StartupProfileForm = {
  company: string;
  tagline: string;
  sector: string;
  stage: string;
  raise: string;
  people: StartupPerson[];
  backers: StartupBacker[];
};

type PostedStartupProfile = StartupProfileForm & {
  id: string;
  submittedAt: string;
};

const emptyPerson: StartupPerson = { name: "", relationship: "Founder" };
const emptyBacker: StartupBacker = { name: "", type: "Programme" };
const startupSectors = ["Fintech", "Healthtech", "Edtech", "AI", "SaaS", "Climate", "Marketplace", "Deeptech"];
const postedStartupProfilesKey = "covalent-posted-startup-profiles";
const postedStartupImages: Record<string, string> = {
  Fintech: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
  Healthtech: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  Edtech: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  AI: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  SaaS: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  Climate: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
  Marketplace: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1200&q=80",
  Deeptech: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
};

type DisplayOpportunity = BrowseOpportunity & {
  postedProfileId?: string;
};

function createStartupProfileForm(): StartupProfileForm {
  return {
    company: "",
    tagline: "",
    sector: "",
    stage: "Pre-seed",
    raise: "",
    people: [{ ...emptyPerson }],
    backers: [{ ...emptyBacker }],
  };
}

function readPostedStartupProfiles(): PostedStartupProfile[] {
  if (typeof window === "undefined") return [];

  const savedProfiles = window.localStorage.getItem(postedStartupProfilesKey);
  if (!savedProfiles) return [];

  try {
    return JSON.parse(savedProfiles);
  } catch {
    window.localStorage.removeItem(postedStartupProfilesKey);
    return [];
  }
}

function getInitials(value: string, fallback: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return fallback;
  return words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join("");
}

function postedProfileToOpportunity(profile: PostedStartupProfile): DisplayOpportunity {
  return {
    title: profile.company || "Untitled startup",
    type: "startup",
    image: postedStartupImages[profile.sector] ?? postedStartupImages.SaaS,
    alt: `${profile.company || "Posted startup"} startup profile`,
    summary: profile.tagline || "Founder-submitted startup profile for investor and mentor discovery.",
    meta: `${profile.stage}  •  ${profile.sector || "Sector pending"}${profile.raise ? `  •  ${profile.raise}` : ""}`,
    cta: "View startup",
    className: "lg:col-span-4",
    postedProfileId: profile.id,
  };
}

export function AudienceBrowsePage({ audience, opportunities, theme }: AudienceBrowsePageProps) {
  const [startupFormOpen, setStartupFormOpen] = useState(false);
  const [startupVisibilityOpen, setStartupVisibilityOpen] = useState(false);
  const [startupForm, setStartupForm] = useState<StartupProfileForm>(() => createStartupProfileForm());
  const [postedProfiles, setPostedProfiles] = useState<PostedStartupProfile[]>(() => readPostedStartupProfiles());
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const postedOpportunities = audience === "startup" ? [] : postedProfiles.map(postedProfileToOpportunity);
  const aiOpportunities: DisplayOpportunity[] = opportunities.slice(0, 3);
  const browseMore: DisplayOpportunity[] = audience === "startup"
    ? opportunities.slice(3)
    : [...postedOpportunities, ...opportunities.slice(3)];

  function getOpportunityHref(item: DisplayOpportunity) {
    if (item.postedProfileId) return `/${audience}`;
    return `/opportunities/${getOpportunitySlug(audience, item.title)}`;
  }

  function getAiCalculation(item: DisplayOpportunity): AiCalculation {
    if (!item.postedProfileId) return aiCalculations[audience][item.title] ?? aiCalculationFallback;

    if (audience === "investors") {
      return {
        score: 91,
        factors: [
          { label: "Founder signal", value: 35 },
          { label: "Sector fit", value: 31 },
          { label: "Raise intent", value: 25 },
        ],
      };
    }

    return {
      score: 88,
      factors: [
        { label: "Mentor need", value: 34 },
        { label: "Stage fit", value: 29 },
        { label: "Team context", value: 25 },
      ],
    };
  }

  function openNewStartupForm() {
    setStartupForm(createStartupProfileForm());
    setEditingProfileId(null);
    setStartupFormOpen(true);
  }

  function openEditStartupForm(profile: PostedStartupProfile) {
    setStartupForm({
      company: profile.company,
      tagline: profile.tagline,
      sector: profile.sector,
      stage: profile.stage,
      raise: profile.raise,
      people: profile.people.length > 0 ? profile.people : [{ ...emptyPerson }],
      backers: profile.backers.length > 0 ? profile.backers : [{ ...emptyBacker }],
    });
    setEditingProfileId(profile.id);
    setStartupFormOpen(true);
  }

  function closeStartupForm() {
    setStartupFormOpen(false);
    setEditingProfileId(null);
    setStartupForm(createStartupProfileForm());
  }

  function updateStartupForm(field: keyof Omit<StartupProfileForm, "people" | "backers">, value: string) {
    setStartupForm((current) => ({ ...current, [field]: value }));
  }

  function updatePerson(index: number, field: keyof StartupPerson, value: string) {
    setStartupForm((current) => ({
      ...current,
      people: current.people.map((person, personIndex) =>
        personIndex === index ? { ...person, [field]: value } : person
      ),
    }));
  }

  function updateBacker(index: number, field: keyof StartupBacker, value: string) {
    setStartupForm((current) => ({
      ...current,
      backers: current.backers.map((backer, backerIndex) =>
        backerIndex === index ? { ...backer, [field]: value } : backer
      ),
    }));
  }

  function submitStartupProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextProfiles = editingProfileId
      ? postedProfiles.map((profile) =>
          profile.id === editingProfileId
            ? { ...profile, ...startupForm }
            : profile
        )
      : [
          {
            ...startupForm,
            id: `${Date.now()}`,
            submittedAt: new Date().toISOString(),
          },
          ...postedProfiles,
        ];

    setPostedProfiles(nextProfiles);
    window.localStorage.setItem(postedStartupProfilesKey, JSON.stringify(nextProfiles));
    setStartupForm(createStartupProfileForm());
    setEditingProfileId(null);
    setStartupFormOpen(false);
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-6 sm:px-10 lg:px-12 lg:py-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-line bg-card px-5 py-3">
        <Link href="/" className="text-lg leading-none">
          <BrandMark />
        </Link>

        <div className="flex items-center justify-self-center gap-3">
          <span className="text-lg font-medium text-foreground sm:text-xl">I&apos;m a</span>
          <NavHeader items={headerLinks} />
        </div>

        <HeaderActions />
      </header>

      <section className={`rounded-[1.75rem] border border-line p-4 sm:p-6 ${theme.sectionGradientClass}`}>
        <div className="space-y-6">
          {audience === "startup" ? (
            <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-4 shadow-[0_18px_54px_rgba(60,64,67,0.08)] backdrop-blur-sm sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Investor visibility</p>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">Post your startup profile for investors</h2>
                  {startupVisibilityOpen ? (
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
                      Share only the essentials: pitch, team, raise, and backers.
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => setStartupVisibilityOpen((current) => !current)}
                    className="inline-flex rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/10"
                  >
                    {startupVisibilityOpen ? "Hide drafts" : "Show drafts"}
                  </button>
                  <button
                    type="button"
                    onClick={openNewStartupForm}
                    className="inline-flex rounded-full bg-[var(--color-google-blue)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Post my startup profile for investors
                  </button>
                </div>
              </div>

              {startupVisibilityOpen && postedProfiles.length > 0 ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {postedProfiles.map((profile, index) => (
                    <div key={profile.id ?? `${profile.company}-${index}`} className="rounded-2xl border border-line bg-white p-4 shadow-[0_12px_30px_rgba(60,64,67,0.06)]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-google-blue-soft)] text-sm font-bold text-[var(--color-google-blue)]">
                            {getInitials(profile.company, "S")}
                          </span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Posted for investors</p>
                            <h3 className="mt-1 text-lg font-semibold text-foreground">{profile.company}</h3>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="rounded-full bg-[var(--color-google-green-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-google-green)]">
                            Live draft
                          </span>
                          <button
                            type="button"
                            onClick={() => openEditStartupForm(profile)}
                            className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-foreground transition hover:bg-muted/10"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">{profile.tagline || "One-line pitch pending"}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-muted">
                        <span className="rounded-full bg-muted/10 px-3 py-1">{profile.stage}</span>
                        <span className="rounded-full bg-muted/10 px-3 py-1">{profile.sector || "Sector pending"}</span>
                        <span className="rounded-full bg-muted/10 px-3 py-1">{profile.raise || "Raise TBD"}</span>
                      </div>
                      <p className="mt-4 text-xs text-muted">
                        People: {profile.people.filter((person) => person.name.trim()).map((person) => person.name).join(", ") || "Pending"}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Backed by: {profile.backers.filter((backer) => backer.name.trim()).map((backer) => backer.name).join(", ") || "Not listed yet"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="flex items-end justify-between gap-4 px-1">
            <div className="w-full">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">AI Recommended</p>
              <h1 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">
                {aiSuggestionHeadings[audience]}
              </h1>
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {aiOpportunities.map((item, index) => {
              const calculation = getAiCalculation(item);

              return (
                <div key={`${item.postedProfileId ?? item.title}-${index}`} className="space-y-3">
                  <OpportunityCard
                    glowClass={theme.headerGlowClass}
                    href={getOpportunityHref(item)}
                    index={index}
                    item={item}
                    recommended
                  />

                  <div className="px-2">
                    <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      <span>AI match score</span>
                      <span className="text-foreground">{calculation.score}%</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {calculation.factors.map((factor) => (
                        <div key={factor.label}>
                          <div className="flex items-center justify-between gap-3 text-[11px] font-medium text-muted">
                            <span>{factor.label}</span>
                            <span className="font-semibold text-foreground">{factor.value}%</span>
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/10">
                            <div className="h-full rounded-full bg-foreground" style={{ width: `${factor.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {browseMore.map((item, index) => (
              <OpportunityCard
                key={`${item.postedProfileId ?? item.title}-${index}`}
                glowClass={theme.headerGlowClass}
                href={getOpportunityHref(item)}
                index={3 + index}
                item={item}
              />
            ))}
          </div>
        </div>
      </section>

      {startupFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-line bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Startup profile</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  {editingProfileId ? "Edit startup snapshot" : "Post a startup snapshot"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeStartupForm}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/10"
              >
                Close
              </button>
            </div>

            <form className="mt-6 space-y-6" onSubmit={submitStartupProfile}>
              <section className="space-y-4 rounded-2xl border border-[var(--color-google-blue-soft)] bg-[var(--color-google-blue-soft)]/40 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-google-blue)] text-sm font-bold text-white">1</span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Company snapshot</h3>
                    <p className="text-xs text-muted">Just enough for investors to scan.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <input
                    required
                    value={startupForm.company}
                    onChange={(event) => updateStartupForm("company", event.target.value)}
                    className="w-full rounded-xl border border-white bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-google-blue)]"
                    placeholder="Company name"
                  />
                  <input
                    value={startupForm.tagline}
                    onChange={(event) => updateStartupForm("tagline", event.target.value)}
                    className="w-full rounded-xl border border-white bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-google-blue)]"
                    placeholder="One-line pitch"
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <select
                      value={startupForm.stage}
                      onChange={(event) => updateStartupForm("stage", event.target.value)}
                      className="rounded-xl border border-white bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-google-blue)]"
                    >
                      <option>Idea</option>
                      <option>Pre-seed</option>
                      <option>Seed</option>
                      <option>Series A</option>
                      <option>Growth</option>
                    </select>
                    <select
                      value={startupForm.sector}
                      onChange={(event) => updateStartupForm("sector", event.target.value)}
                      className="rounded-xl border border-white bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-google-blue)]"
                    >
                      <option value="">Sector</option>
                      {startupSectors.map((sector) => (
                        <option key={sector}>{sector}</option>
                      ))}
                    </select>
                    <input
                      value={startupForm.raise}
                      onChange={(event) => updateStartupForm("raise", event.target.value)}
                      className="rounded-xl border border-white bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-google-blue)]"
                      placeholder="Raise / ask"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4 rounded-2xl border border-[var(--color-google-green-soft)] bg-[var(--color-google-green-soft)]/45 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-google-green)] text-sm font-bold text-white">2</span>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">People</h3>
                      <p className="text-xs text-muted">Founders, cofounders, advisors.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStartupForm((current) => ({ ...current, people: [...current.people, { ...emptyPerson }] }))}
                    className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[var(--color-google-green)] transition hover:opacity-80"
                  >
                    Add person
                  </button>
                </div>

                <div className="space-y-3">
                  {startupForm.people.map((person, index) => (
                    <div key={index} className="grid gap-3 rounded-2xl bg-white p-3 sm:grid-cols-[auto_1fr_0.85fr] sm:items-center">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-google-green-soft)] text-sm font-bold text-[var(--color-google-green)]">
                        {getInitials(person.name, `${index + 1}`)}
                      </span>
                      <input
                        value={person.name}
                        onChange={(event) => updatePerson(index, "name", event.target.value)}
                        className="rounded-xl border border-line px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-google-green)]"
                        placeholder="Name"
                      />
                      <select
                        value={person.relationship}
                        onChange={(event) => updatePerson(index, "relationship", event.target.value)}
                        className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-google-green)]"
                      >
                        <option>Founder</option>
                        <option>Cofounder</option>
                        <option>Advisor</option>
                        <option>Operator</option>
                        <option>Angel</option>
                      </select>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4 rounded-2xl border border-[var(--color-google-yellow-soft)] bg-[var(--color-google-yellow-soft)]/55 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-google-yellow)] text-sm font-bold text-[#3c2a00]">3</span>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Backed by</h3>
                      <p className="text-xs text-muted">Optional proof points.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStartupForm((current) => ({ ...current, backers: [...current.backers, { ...emptyBacker }] }))}
                    className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#8a6500] transition hover:opacity-80"
                  >
                    Add backer
                  </button>
                </div>

                <div className="space-y-3">
                  {startupForm.backers.map((backer, index) => (
                    <div key={index} className="grid gap-3 rounded-2xl bg-white p-3 sm:grid-cols-[auto_1fr_0.85fr] sm:items-center">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-google-yellow-soft)] text-sm font-bold text-[#8a6500]">
                        {getInitials(backer.name, `${index + 1}`)}
                      </span>
                      <input
                        value={backer.name}
                        onChange={(event) => updateBacker(index, "name", event.target.value)}
                        className="rounded-xl border border-line px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-google-yellow)]"
                        placeholder="Backer, grant, customer"
                      />
                      <select
                        value={backer.type}
                        onChange={(event) => updateBacker(index, "type", event.target.value)}
                        className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-google-yellow)]"
                      >
                        <option>Programme</option>
                        <option>Angel</option>
                        <option>VC</option>
                        <option>Grant</option>
                        <option>Accelerator</option>
                        <option>Customer</option>
                      </select>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeStartupForm}
                  className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/10"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-full bg-[var(--color-google-blue)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                  {editingProfileId ? "Save changes" : "Post profile draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
