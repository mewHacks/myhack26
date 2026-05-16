export type AudienceSlug = "startup" | "investors" | "mentors";

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

export type HistoryEntry = {
  name: string;
  label?: string;
  avatar?: string;
  children?: HistoryEntry[];
};

export type HistoryGroup = {
  title: string;
  entries: HistoryEntry[];
};

export const defaultHistoryGroups: Record<OpportunityType, HistoryGroup[]> = {
  program: [
    {
      title: "Led by",
      entries: [
        {
          name: "Aisha Tan",
          label: "Investor",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "AI Fund",
              label: "LP network",
              avatar: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=160&q=80",
            },
            {
              name: "Cloud Studio",
              label: "operator bench",
              avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
        {
          name: "Ben Carter",
          label: "Operator",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Launch Team",
              label: "GTM",
              avatar: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
        {
          name: "Clara Wong",
          label: "Partner",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Demo Guild",
              label: "reviewers",
              avatar: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
      ],
    },
    {
      title: "Experience",
      entries: [
        {
          name: "ex-Google AI",
          label: "operator",
          avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Vertex AI",
              label: "platform",
              avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=160&q=80",
            },
            {
              name: "Search PM",
              label: "product",
              avatar: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
        {
          name: "12 startups",
          label: "backed",
          avatar: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "4 AI tools",
              label: "portfolio",
              avatar: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
        {
          name: "YC mentor",
          label: "network",
          avatar: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Batch alumni",
              label: "founders",
              avatar: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
      ],
    },
    {
      title: "Backed by",
      entries: [
        {
          name: "Northstar",
          label: "seed fund",
          avatar: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Seed LPs",
              label: "capital",
              avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
        {
          name: "Orbit",
          label: "infra",
          avatar: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Infra angels",
              label: "operators",
              avatar: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
      ],
    },
  ],
  investor: [
    {
      title: "Team",
      entries: [
        {
          name: "Mira Shah",
          label: "GP",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Scout Circle",
              label: "deal flow",
              avatar: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=160&q=80",
            },
            {
              name: "Founder LPs",
              label: "operators",
              avatar: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
        {
          name: "Leo Park",
          label: "Scout",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Campus leads",
              label: "sourcing",
              avatar: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
      ],
    },
    {
      title: "Track record",
      entries: [
        {
          name: "Seed lead",
          label: "rounds",
          avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Pre-seed",
              label: "checks",
              avatar: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
        {
          name: "3 exits",
          label: "portfolio",
          avatar: "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "M&A bench",
              label: "advisors",
              avatar: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
        {
          name: "AI infra",
          label: "focus",
          avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Data stack",
              label: "thesis",
              avatar: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
      ],
    },
    {
      title: "Backed by",
      entries: [
        {
          name: "Alumni LPs",
          label: "Google",
          avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Cloud alumni",
              label: "network",
              avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
        {
          name: "Operator angels",
          label: "Stripe",
          avatar: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Fintech leads",
              label: "operators",
              avatar: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
      ],
    },
  ],
  mentor: [
    {
      title: "Guided by",
      entries: [
        {
          name: "Olivia Chen",
          label: "Product",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "UX reviewers",
              label: "design",
              avatar: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
        {
          name: "Noah Reed",
          label: "GTM",
          avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Sales bench",
              label: "GTM",
              avatar: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
      ],
    },
    {
      title: "Experience",
      entries: [
        {
          name: "PM lead",
          label: "Google",
          avatar: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Roadmaps",
              label: "product",
              avatar: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
        {
          name: "Series A",
          label: "coach",
          avatar: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Pitch reps",
              label: "fundraise",
              avatar: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
        {
          name: "Demo day",
          label: "judge",
          avatar: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Story desk",
              label: "narrative",
              avatar: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
      ],
    },
    {
      title: "Worked with",
      entries: [
        {
          name: "YC teams",
          label: "mentor",
          avatar: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Batch founders",
              label: "peer group",
              avatar: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
        {
          name: "AI founders",
          label: "growth",
          avatar: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Launch cohort",
              label: "early users",
              avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
      ],
    },
  ],
};

export type BrowseOpportunity = {
  title: string;
  type: OpportunityType;
  image: string;
  alt: string;
  summary: string;
  meta: string;
  cta: string;
  className: string;
  historyGroups?: HistoryGroup[];
};

export function getOpportunitySlug(audience: AudienceSlug, title: string) {
  return `${audience}-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

export type BrowsePageTheme = {
  sectionGradientClass: string;
  headerGlowClass: string;
};

export const browsePageThemes: Record<AudienceSlug, BrowsePageTheme> = {
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

export const browsePages: Record<AudienceSlug, BrowseOpportunity[]> = {
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
