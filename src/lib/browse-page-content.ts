export const headerLinks = [
  { href: "/startup", label: "Startup", color: "var(--color-google-blue)" },
  { href: "/mentors", label: "Mentors", color: "var(--color-google-yellow)" },
  { href: "/investors", label: "Investors", color: "var(--color-google-green)" },
];

export const opportunityTypes = {
  program: {
    label: "Program",
    badgeClass: "bg-[var(--color-google-blue-soft)] text-[var(--color-google-blue)]",
    buttonClass: "bg-[var(--color-google-blue)] text-white",
  },
  investor: {
    label: "Investor",
    badgeClass: "bg-[var(--color-google-yellow-soft)] text-[#8a6500]",
    buttonClass: "bg-[var(--color-google-yellow)] text-[#3c2a00]",
  },
  mentor: {
    label: "Mentor",
    badgeClass: "bg-[var(--color-google-green-soft)] text-[var(--color-google-green)]",
    buttonClass: "bg-[var(--color-google-green)] text-white",
  },
} as const;

export type OpportunityType = keyof typeof opportunityTypes;

export type BrowseOpportunity = {
  title: string;
  type: OpportunityType;
  image: string;
  alt: string;
  summary: string;
  meta: string;
  cta: string;
  className: string;
};

export type BrowsePageTheme = {
  sectionGradientClass: string;
  headerGlowClass: string;
};

export const browsePageThemes: Record<"startup" | "investors" | "mentors", BrowsePageTheme> = {
  startup: {
    sectionGradientClass:
      "bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_52%,rgba(66,133,244,0.16)_100%)]",
    headerGlowClass: "shadow-[inset_-120px_0_140px_rgba(66,133,244,0.08)]",
  },
  investors: {
    sectionGradientClass:
      "bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_48%,rgba(52,168,83,0.14)_100%)]",
    headerGlowClass: "shadow-[inset_-120px_0_140px_rgba(52,168,83,0.08)]",
  },
  mentors: {
    sectionGradientClass:
      "bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_48%,rgba(251,188,5,0.16)_100%)]",
    headerGlowClass: "shadow-[inset_-120px_0_140px_rgba(251,188,5,0.08)]",
  },
};

export const browsePages: Record<"startup" | "investors" | "mentors", BrowseOpportunity[]> = {
  startup: [
    {
      title: "Founder Residency",
      type: "program",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      alt: "Startup team gathered around laptops",
      summary: "12-week operator-led sprint with weekly product reviews and warm intros.",
      meta: "MVP to first traction  •  APAC + Remote",
      cta: "View program",
      className: "lg:col-span-7 lg:row-span-2",
    },
    {
      title: "Northstar Capital",
      type: "investor",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
      alt: "Investors talking across a meeting table",
      summary: "Writes first checks into technical teams shipping quickly in data and infra.",
      meta: "Pre-seed to seed  •  Global",
      cta: "Request intro",
      className: "lg:col-span-5",
    },
    {
      title: "Olivia Chen",
      type: "mentor",
      image:
        "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80",
      alt: "One-on-one mentor conversation",
      summary: "Helps founders sharpen product story, demos, and investor narrative in one pass.",
      meta: "Pitch  •  GTM  •  Product",
      cta: "Book mentor",
      className: "lg:col-span-5",
    },
    {
      title: "Launchpad Demo Week",
      type: "program",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      alt: "Startup founder presenting on stage",
      summary: "A short, high-pressure program focused on demo polish and sponsor visibility.",
      meta: "Demo-ready  •  In person",
      cta: "View program",
      className: "lg:col-span-4",
    },
    {
      title: "Greenlight Ventures",
      type: "investor",
      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
      alt: "Handshake after a startup meeting",
      summary: "Actively looking for teams building applied AI and workflow tools with early pull.",
      meta: "AI  •  B2B SaaS",
      cta: "Request intro",
      className: "lg:col-span-4",
    },
    {
      title: "Maya Rodriguez",
      type: "mentor",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
      alt: "Mentor leading a workshop discussion",
      summary: "Best for teams that need fast UX feedback before customer calls and demos.",
      meta: "Design  •  User research",
      cta: "Book mentor",
      className: "lg:col-span-4",
    },
    {
      title: "Catalyst Fellows",
      type: "program",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
      alt: "Product review meeting around a table",
      summary: "Hands-on founder support with mentor office hours, legal templates, and hiring help.",
      meta: "Early revenue  •  SEA",
      cta: "View program",
      className: "lg:col-span-3",
    },
    {
      title: "Orbit Seed",
      type: "investor",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
      alt: "Investor notes on financial planning documents",
      summary: "Moves fast on software teams with a clear wedge, strong founder-market fit, and urgency.",
      meta: "Seed  •  Remote-first",
      cta: "Request intro",
      className: "lg:col-span-3",
    },
    {
      title: "Rina Park",
      type: "mentor",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
      alt: "Team reviewing notes on a wall",
      summary: "Supports teams who need decision clarity on roadmap, priorities, and launch timing.",
      meta: "Execution  •  Strategy",
      cta: "Book mentor",
      className: "lg:col-span-3",
    },
  ],
  investors: [
    {
      title: "Signal Roundup",
      type: "program",
      image:
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80",
      alt: "Investor team reviewing startup materials",
      summary: "A curated batch of teams with traction notes, vertical tags, and warm context.",
      meta: "Fresh this week  •  Multi-sector",
      cta: "View batch",
      className: "lg:col-span-7 lg:row-span-2",
    },
    {
      title: "Covalent AI Index",
      type: "program",
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80",
      alt: "Financial documents and charts on a desk",
      summary: "A rapid scan of AI teams with product status, founder notes, and follow-up readiness.",
      meta: "AI  •  Seed",
      cta: "Explore index",
      className: "lg:col-span-5",
    },
    {
      title: "Kira Patel",
      type: "mentor",
      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
      alt: "Partner greeting founders after a meeting",
      summary: "Helps investors refine conviction fast with sharper founder-market-fit questions.",
      meta: "Diligence  •  Market maps",
      cta: "Book session",
      className: "lg:col-span-5",
    },
    {
      title: "Northstar Capital",
      type: "investor",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
      alt: "Investors talking across a meeting table",
      summary: "Operators-first fund actively looking for technical teams with early customer velocity.",
      meta: "Pre-seed to seed  •  Global",
      cta: "View profile",
      className: "lg:col-span-4",
    },
    {
      title: "Greenlight Ventures",
      type: "investor",
      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
      alt: "Handshake after a startup meeting",
      summary: "Looking for applied AI, workflow tools, and infrastructure with visible pull.",
      meta: "AI  •  B2B SaaS",
      cta: "View profile",
      className: "lg:col-span-4",
    },
    {
      title: "Orbit Seed",
      type: "investor",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
      alt: "Investor notes on financial planning documents",
      summary: "Moves quickly when the product wedge is obvious and founder urgency is high.",
      meta: "Seed  •  Remote-first",
      cta: "View profile",
      className: "lg:col-span-4",
    },
    {
      title: "Partner Office Hours",
      type: "mentor",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      alt: "Startup founders in discussion with notes and laptops",
      summary: "Short tactical sessions to help investors compare teams and pressure-test narratives.",
      meta: "Live review  •  20 min",
      cta: "Reserve slot",
      className: "lg:col-span-3",
    },
    {
      title: "Pipeline Notes",
      type: "program",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      alt: "Analytics dashboard on a screen",
      summary: "Organized snapshots of traction, product readiness, and founder follow-up signals.",
      meta: "Scorecards  •  Shared",
      cta: "Open notes",
      className: "lg:col-span-3",
    },
    {
      title: "Thesis Review",
      type: "mentor",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      alt: "Presentation screen during an investor review",
      summary: "A focused review to tighten sourcing themes before the next founder batch arrives.",
      meta: "Strategy  •  Sector focus",
      cta: "Book review",
      className: "lg:col-span-3",
    },
  ],
  mentors: [
    {
      title: "Open Office Hours",
      type: "program",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      alt: "Mentor leading a collaborative working session",
      summary: "A live board of founders needing help across product, design, engineering, and pitch.",
      meta: "Daily requests  •  Live",
      cta: "See requests",
      className: "lg:col-span-7 lg:row-span-2",
    },
    {
      title: "Rina Park",
      type: "mentor",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
      alt: "Team reviewing notes on a wall",
      summary: "Supports roadmap clarity, launch decisions, and execution prioritization.",
      meta: "Execution  •  Strategy",
      cta: "View mentor",
      className: "lg:col-span-5",
    },
    {
      title: "Maya Rodriguez",
      type: "mentor",
      image:
        "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80",
      alt: "One-on-one mentor conversation",
      summary: "Works with teams on UX clarity before demos, calls, and product reviews.",
      meta: "Design  •  User research",
      cta: "View mentor",
      className: "lg:col-span-5",
    },
    {
      title: "Pitch Rescue",
      type: "program",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      alt: "Founder presenting in a room",
      summary: "Time-boxed sessions for teams that need a sharper story before investor meetings.",
      meta: "Story  •  Demo",
      cta: "Join session",
      className: "lg:col-span-4",
    },
    {
      title: "Olivia Chen",
      type: "mentor",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
      alt: "Mentor in a team conversation",
      summary: "Helps founders tighten investor narrative, product framing, and demo flow.",
      meta: "Pitch  •  GTM  •  Product",
      cta: "View mentor",
      className: "lg:col-span-4",
    },
    {
      title: "Frontend Clinic",
      type: "program",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
      alt: "Product review meeting around a table",
      summary: "Short sessions for interface polish, UX fixes, and demo-critical visual feedback.",
      meta: "UI  •  Product",
      cta: "See openings",
      className: "lg:col-span-4",
    },
    {
      title: "Northstar Capital",
      type: "investor",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
      alt: "Investors talking across a meeting table",
      summary: "Useful context for mentors coaching teams toward imminent fundraising conversations.",
      meta: "Fundraising  •  Context",
      cta: "See investor lens",
      className: "lg:col-span-3",
    },
    {
      title: "Founder Queue",
      type: "program",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      alt: "Startup team gathered around laptops",
      summary: "A sorted queue of startups currently requesting product, growth, and technical feedback.",
      meta: "Active now  •  Sorted",
      cta: "Open queue",
      className: "lg:col-span-3",
    },
    {
      title: "Mentor Roundtable",
      type: "program",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
      alt: "Notes on a wall during a collaborative session",
      summary: "A shared discussion space for aligning advice and spotting recurring founder blockers.",
      meta: "Peer support  •  Weekly",
      cta: "Join roundtable",
      className: "lg:col-span-3",
    },
  ],
};
