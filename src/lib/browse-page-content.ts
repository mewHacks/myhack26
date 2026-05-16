export type AudienceSlug = "startup" | "investors" | "mentors";

export const headerLinks = [
  { href: "/startup", label: "Startup", color: "var(--color-google-blue)" },
  { href: "/mentors", label: "Mentors", color: "var(--color-google-yellow)" },
  { href: "/investors", label: "Investors", color: "var(--color-google-green)" },
];

export const opportunityTypes = {
  program: {
    label: "Programme",
    badgeClass: "bg-[var(--color-google-blue-soft)] text-[var(--color-google-blue)]",
    buttonClass: "bg-[var(--color-google-blue)] text-white",
  },
  investor: {
    label: "Investor",
    badgeClass: "bg-[var(--color-google-yellow-soft)] text-[#8a6500]",
    buttonClass: "bg-[var(--color-google-yellow)] text-[#3c2a00]",
  },
  startup: {
    label: "Startup",
    badgeClass: "bg-[var(--color-google-red-soft)] text-[var(--color-google-red)]",
    buttonClass: "bg-[var(--color-google-red)] text-white",
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
  startup: [
    {
      title: "Investment signal",
      entries: [
        {
          name: "Founder-market fit",
          label: "startup",
          avatar: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Early traction",
              label: "signal",
              avatar: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=160&q=80",
            },
          ],
        },
      ],
    },
    {
      title: "Needs",
      entries: [
        {
          name: "Capital",
          label: "growth",
          avatar: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=160&q=80",
          children: [
            {
              name: "Warm intros",
              label: "network",
              avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=160&q=80",
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

export function getProfileSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

const mystartupAssets = "https://www.mystartup.gov.my/assets/images/web";
const mystartupStorage = "https://mystartupprodstorage.blob.core.windows.net";

const mystartupCardImages = {
  governmentBanner: `${mystartupAssets}/government/Group%2032645@2x.png`,
  investorBanner: `${mystartupAssets}/investor/Group%2032643@2x.png`,
  techTalentBanner: `${mystartupAssets}/developer/Group%2032644@2x.png`,
  newsEventsBanner: `${mystartupAssets}/news-events/new_events_banner@2x.png`,
  e27: `${mystartupStorage}/programimage/yii96q/e27.png`,
  klInnovationBelt: `${mystartupStorage}/programimage/9uy8vn/KL%20Innovation%20Belt.PNG`,
  vcGoldenPass: `${mystartupStorage}/programimage/7euk0b/VC%20Golden%20Pass.PNG`,
  codingBootcamp: `${mystartupStorage}/programimage/rmkf3b/image-20230511-000017.png`,
  strategicResearchFund: `${mystartupStorage}/programimage/81wc1r/strategic%20research%20fund%20.jpg`,
  proofHackathon: `${mystartupStorage}/programimage/3hlnr0/Screenshot%202026-03-12%20111207_cropped_processed_by_imagy.png`,
  devMalaysia: `${mystartupStorage}/community/community-image/dev-malaysia-7eaa6ff4-3512-45c4-842f-5ab58db49172.jpeg`,
};

const stockImages = {
  funding: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
  ventureGrowth: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
  privateCapital: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  programmes: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
  accelerator: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  validation: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  bootcamp: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  hackathon: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
  perks: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
  globalExpansion: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  directory: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  learning: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  businessServices: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  founderGuides: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  investorDirectory: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  fundOfFund: "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80",
  investorProgrammes: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80",
  taxIncentives: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
  associations: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80",
  startupJobs: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
  techCommunity: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  apiHub: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  cloudLearning: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
  generativeAi: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  mentorCoaching: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  fintechStartup: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
  healthtechStartup: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  edtechStartup: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
};

export const browsePages: Record<AudienceSlug, BrowseOpportunity[]> = {
  startup: [
    {
      title: "James Foo",
      type: "mentor",
      image: stockImages.mentorCoaching,
      alt: "Mentor leading a workshop discussion",
      summary: "Fintech and fundraising mentor for seed-stage founders building payments or B2B SaaS products.",
      meta: "Mentor  •  Fintech & fundraising",
      cta: "Book mentor",
      className: "lg:col-span-7 lg:row-span-2",
    },
    {
      title: "MYStartup VentureX",
      type: "program",
      image: stockImages.ventureGrowth,
      alt: "Startup growth planning session",
      summary: "A growth and funding platform for startups preparing to scale beyond early validation.",
      meta: "Programmes  •  Growth & funding",
      cta: "View programme",
      className: "lg:col-span-5",
    },
    {
      title: "Private Funding Firms",
      type: "investor",
      image: stockImages.privateCapital,
      alt: "Investors reviewing startup funding opportunities",
      summary: "Find local and global private startup funding firms across the Malaysian ecosystem.",
      meta: "Investor  •  Private capital",
      cta: "Find investors",
      className: "lg:col-span-5",
    },
    {
      title: "Government Funding",
      type: "program",
      image: mystartupCardImages.governmentBanner,
      alt: "MYStartup government funding banner",
      summary: "Access a centralised directory of government funding for Malaysian startups across stages.",
      meta: "Funding  •  Government",
      cta: "Explore funding",
      className: "lg:col-span-4",
    },
    {
      title: "Apply for Funding",
      type: "program",
      image: stockImages.funding,
      alt: "Funding documents and charts on a desk",
      summary: "Apply to unlock startup funding opportunities matched to your growth and scaling journey.",
      meta: "Funding  •  Applications",
      cta: "Apply now",
      className: "lg:col-span-4",
    },
    {
      title: "Ecosystem Programmes",
      type: "program",
      image: stockImages.programmes,
      alt: "Startup ecosystem event audience",
      summary: "Explore the latest programmes happening across the Malaysian startup ecosystem.",
      meta: "Programmes  •  Ecosystem",
      cta: "Explore programmes",
      className: "lg:col-span-4",
    },
    {
      title: "MYStartup Accelerator",
      type: "program",
      image: stockImages.accelerator,
      alt: "Startup accelerator workshop",
      summary: "Scale beyond borders through a structured MYStartup accelerator pathway.",
      meta: "Programmes  •  Scale",
      cta: "View accelerator",
      className: "lg:col-span-4",
    },
    {
      title: "MYStartup Pre-Accelerator",
      type: "program",
      image: stockImages.validation,
      alt: "Founder presenting validation ideas",
      summary: "Build and validate startup ideas before entering a larger growth programme.",
      meta: "Programmes  •  Validation",
      cta: "Start validating",
      className: "lg:col-span-3",
    },
    {
      title: "MYStartup Bootcamp",
      type: "program",
      image: stockImages.bootcamp,
      alt: "Founders collaborating during a bootcamp",
      summary: "Build a stronger startup mindset through practical MYStartup bootcamp programming.",
      meta: "Programmes  •  Founder skills",
      cta: "Join bootcamp",
      className: "lg:col-span-3",
    },
    {
      title: "MYHackathon",
      type: "program",
      image: stockImages.hackathon,
      alt: "Hackathon team working on digital solutions",
      summary: "A national hackathon to develop digital government solutions with startup builders.",
      meta: "Programmes  •  Hackathon",
      cta: "Explore challenge",
      className: "lg:col-span-3",
    },
    {
      title: "Startup Perks",
      type: "program",
      image: stockImages.perks,
      alt: "Startup team celebrating support perks",
      summary: "Get free deals and ecosystem perks to help your startup grow faster.",
      meta: "Growth & Events  •  Perks",
      cta: "Unlock perks",
      className: "lg:col-span-3",
    },
    {
      title: "Global Expansion",
      type: "program",
      image: stockImages.globalExpansion,
      alt: "Global business expansion discussion",
      summary: "Expand globally to scale your startup beyond Malaysia with ecosystem support.",
      meta: "Growth & Events  •  Global",
      cta: "Plan expansion",
      className: "lg:col-span-3",
    },
    {
      title: "Startup List",
      type: "program",
      image: stockImages.directory,
      alt: "Startup directory dashboard on a laptop",
      summary: "Explore, connect, and grow with Malaysian startups listed in the ecosystem.",
      meta: "Growth & Events  •  Directory",
      cta: "Browse startups",
      className: "lg:col-span-3",
    },
    {
      title: "Learn",
      type: "program",
      image: stockImages.learning,
      alt: "Online learning resources on a laptop",
      summary: "Enhance and refine entrepreneurial skills through startup learning resources.",
      meta: "Learn & Connect  •  Skills",
      cta: "Start learning",
      className: "lg:col-span-3",
    },
    {
      title: "Business Directory",
      type: "program",
      image: stockImages.businessServices,
      alt: "Business services planning documents",
      summary: "Access essential services to support and grow your business operations.",
      meta: "Learn & Connect  •  Services",
      cta: "Find services",
      className: "lg:col-span-3",
    },
    {
      title: "New Founders Guidelines",
      type: "program",
      image: stockImages.founderGuides,
      alt: "Startup team reviewing founder guidelines",
      summary: "Seamlessly navigate startup building with MYStartup's guide for new founders.",
      meta: "Learn & Connect  •  Guidelines",
      cta: "Read guide",
      className: "lg:col-span-3",
    },
  ],
  investors: [
    {
      title: "PayChain",
      type: "startup",
      image: stockImages.fintechStartup,
      alt: "Founder working at a desk",
      summary: "Embedded payment infrastructure for SMEs in SEA with RM 180K ARR and strong month-over-month growth.",
      meta: "Seed  •  Fintech payments",
      cta: "Review startup",
      className: "lg:col-span-7 lg:row-span-2",
    },
    {
      title: "MedSync",
      type: "startup",
      image: stockImages.healthtechStartup,
      alt: "Startup team working together",
      summary: "AI-powered patient record synchronisation across Malaysian private clinics with active beta usage.",
      meta: "Pre-seed  •  Healthtech AI",
      cta: "Review startup",
      className: "lg:col-span-5",
    },
    {
      title: "SkillLoop",
      type: "startup",
      image: stockImages.edtechStartup,
      alt: "Founder presenting on stage",
      summary: "Personalised upskilling platform for fresh graduates with 1,200 users and premium testing underway.",
      meta: "Pre-seed  •  Edtech AI",
      cta: "Review startup",
      className: "lg:col-span-5",
    },
    {
      title: "Investor Guidelines",
      type: "program",
      image: mystartupCardImages.investorBanner,
      alt: "MYStartup investor banner",
      summary: "Navigate Malaysia's investment landscape with centralised investor guidance and resources.",
      meta: "Investment Hub  •  Guidelines",
      cta: "View guidelines",
      className: "lg:col-span-7 lg:row-span-2",
    },
    {
      title: "Investor List",
      type: "investor",
      image: stockImages.investorDirectory,
      alt: "Investor directory analytics dashboard",
      summary: "Explore curated investor lists across the Malaysian startup ecosystem.",
      meta: "Investment Hub  •  Directory",
      cta: "Browse investors",
      className: "lg:col-span-5",
    },
    {
      title: "Jelawang Capital",
      type: "investor",
      image: stockImages.fundOfFund,
      alt: "Venture capital strategy documents",
      summary: "Build a resilient, dynamic venture capital ecosystem through Malaysia's fund-of-fund platform.",
      meta: "Fund-of-Fund  •  Venture capital",
      cta: "View fund",
      className: "lg:col-span-5",
    },
    {
      title: "Investor Programmes",
      type: "program",
      image: stockImages.investorProgrammes,
      alt: "Investor programme meeting",
      summary: "Explore the latest investor programmes happening across the startup ecosystem.",
      meta: "Programmes & Events  •  Investors",
      cta: "Explore programmes",
      className: "lg:col-span-4",
    },
    {
      title: "Events",
      type: "program",
      image: mystartupCardImages.newsEventsBanner,
      alt: "MYStartup news and events banner",
      summary: "Explore events that connect investors, founders, and ecosystem builders.",
      meta: "Programmes & Events  •  Networking",
      cta: "View events",
      className: "lg:col-span-4",
    },
    {
      title: "Malaysia Co-Investment Fund (MyCIF)",
      type: "program",
      image: stockImages.taxIncentives,
      alt: "Investment incentive documents",
      summary: "Review co-investment support available through Malaysia's capital market ecosystem.",
      meta: "Investor Guidelines  •  ECF",
      cta: "View details",
      className: "lg:col-span-4",
    },
    {
      title: "Equity Crowdfunding Tax Exemption",
      type: "program",
      image: stockImages.taxIncentives,
      alt: "Tax incentive planning documents",
      summary: "Understand tax exemption guidance for equity crowdfunding activity in Malaysia.",
      meta: "Tax Incentives  •  ECF",
      cta: "View incentive",
      className: "lg:col-span-3",
    },
    {
      title: "VCPE Practical Guide",
      type: "program",
      image: stockImages.businessServices,
      alt: "Legal and finance guide documents",
      summary: "Access practical guidance for venture capital and private equity participants.",
      meta: "Investor Guidelines  •  VCPE",
      cta: "Read guide",
      className: "lg:col-span-3",
    },
    {
      title: "Malaysian Angel Business Network (MBAN)",
      type: "investor",
      image: stockImages.associations,
      alt: "Angel investor association meeting",
      summary: "Connect with Malaysia's angel investment network for early-stage startup activity.",
      meta: "Associations  •  Angels",
      cta: "View network",
      className: "lg:col-span-3",
    },
    {
      title: "Malaysian Venture Capital and Private Equity Association (MVCA)",
      type: "investor",
      image: stockImages.associations,
      alt: "Venture capital association meeting",
      summary: "Explore the venture capital and private equity association supporting Malaysia's funding ecosystem.",
      meta: "Associations  •  VCPE",
      cta: "View association",
      className: "lg:col-span-3",
    },
    {
      title: "SME International Trade Association (SMITA)",
      type: "investor",
      image: stockImages.associations,
      alt: "Business trade association discussion",
      summary: "Find ecosystem support for SME and startup growth through international trade networks.",
      meta: "Associations  •  Trade",
      cta: "View association",
      className: "lg:col-span-3",
    },
    {
      title: "Angel Tax Incentive",
      type: "program",
      image: stockImages.taxIncentives,
      alt: "Angel tax incentive documents",
      summary: "Review tax incentives that encourage angel investment into innovative startups.",
      meta: "Tax Incentives  •  Angels",
      cta: "Review incentive",
      className: "lg:col-span-3",
    },
    {
      title: "Venture Capital Tax Incentives",
      type: "program",
      image: stockImages.taxIncentives,
      alt: "Venture capital tax incentive documents",
      summary: "Understand venture capital tax incentives available in Malaysia's investment landscape.",
      meta: "Tax Incentives  •  VC",
      cta: "View incentive",
      className: "lg:col-span-3",
    },
    {
      title: "Echelon Singapore 2026",
      type: "program",
      image: mystartupCardImages.e27,
      alt: "Echelon Singapore 2026 programme image",
      summary: "Join the region's leading tech ecosystem event where innovation meets execution.",
      meta: "Programmes  •  Regional",
      cta: "Read more",
      className: "lg:col-span-3",
    },
    {
      title: "KL Innovation Belt",
      type: "program",
      image: mystartupCardImages.klInnovationBelt,
      alt: "KL Innovation Belt programme image",
      summary: "Where ideas meet opportunity across Kuala Lumpur's innovation ecosystem.",
      meta: "Programmes  •  Malaysia",
      cta: "Read more",
      className: "lg:col-span-3",
    },
    {
      title: "VC Golden Pass",
      type: "program",
      image: mystartupCardImages.vcGoldenPass,
      alt: "VC Golden Pass programme image",
      summary: "Attract sizeable global and regional venture capital firms to establish a presence in Malaysia.",
      meta: "Programmes  •  Venture capital",
      cta: "Read more",
      className: "lg:col-span-3",
    },
  ],
  mentors: [
    {
      title: "SkillLoop",
      type: "startup",
      image: stockImages.edtechStartup,
      alt: "Founder presenting on stage",
      summary: "Edtech startup seeking growth mentorship for its AI learning roadmap and premium launch.",
      meta: "Startup  •  Edtech growth",
      cta: "Mentor startup",
      className: "lg:col-span-7 lg:row-span-2",
    },
    {
      title: "PayChain",
      type: "startup",
      image: stockImages.fintechStartup,
      alt: "Founder working at a desk",
      summary: "Fintech startup looking for mentor support on investor narrative and regional expansion.",
      meta: "Startup  •  Fintech fundraising",
      cta: "Mentor startup",
      className: "lg:col-span-5",
    },
    {
      title: "Talent Programmes",
      type: "program",
      image: stockImages.programmes,
      alt: "Tech talent programme workshop",
      summary: "Explore programmes and events designed for tech talent development in the ecosystem.",
      meta: "Programmes & Events  •  Talent",
      cta: "Explore programmes",
      className: "lg:col-span-5",
    },
    {
      title: "Startup Jobs",
      type: "program",
      image: stockImages.startupJobs,
      alt: "Startup job interview conversation",
      summary: "Discover startup job opportunities across Malaysian startups and growth teams.",
      meta: "Talent Hubs  •  Jobs",
      cta: "View jobs",
      className: "lg:col-span-4",
    },
    {
      title: "Tech Talent Community",
      type: "program",
      image: stockImages.techCommunity,
      alt: "Tech talent community meetup",
      summary: "Connect and collaborate with a vibrant tech talent community around startup needs.",
      meta: "Talent Hubs  •  Community",
      cta: "Connect now",
      className: "lg:col-span-4",
    },
    {
      title: "API Hub",
      type: "program",
      image: stockImages.apiHub,
      alt: "Developer workstation for API integration",
      summary: "Discover and integrate APIs to power digital products, tools, and startup solutions.",
      meta: "Talent Hubs  •  APIs",
      cta: "Explore APIs",
      className: "lg:col-span-4",
    },
    {
      title: "Dev Malaysia",
      type: "program",
      image: mystartupCardImages.devMalaysia,
      alt: "Dev Malaysia community image",
      summary: "A developer community linking Kuala Lumpur JavaScript, JuniorDevMY, and DevOps Malaysia.",
      meta: "Community  •  Developers",
      cta: "View community",
      className: "lg:col-span-3",
    },
    {
      title: "MEET Community",
      type: "program",
      image: stockImages.techCommunity,
      alt: "Technology community discussion",
      summary: "A Microsoft certified talent community supporting Malaysia's digital aspiration.",
      meta: "Community  •  Microsoft",
      cta: "View community",
      className: "lg:col-span-3",
    },
    {
      title: "AWS Innovate",
      type: "program",
      image: stockImages.cloudLearning,
      alt: "Cloud engineering learning workspace",
      summary: "A cloud learning resource for tech talent looking to sharpen practical startup skills.",
      meta: "Learn  •  Cloud",
      cta: "Start course",
      className: "lg:col-span-3",
    },
    {
      title: "Generative AI",
      type: "program",
      image: stockImages.generativeAi,
      alt: "Generative AI interface visualization",
      summary: "A long-form AI learning pathway for builders developing modern product capabilities.",
      meta: "Learn  •  AI",
      cta: "Start course",
      className: "lg:col-span-3",
    },
    {
      title: "Software Engineering/Coding Bootcamp",
      type: "program",
      image: mystartupCardImages.codingBootcamp,
      alt: "Software engineering coding bootcamp programme image",
      summary: "Learn full-stack web development through a fast-paced online bootcamp model.",
      meta: "Programmes  •  Engineering",
      cta: "View bootcamp",
      className: "lg:col-span-3",
    },
    {
      title: "Strategic Research Fund",
      type: "program",
      image: mystartupCardImages.strategicResearchFund,
      alt: "Strategic Research Fund programme image",
      summary: "A MOSTI funding programme supporting strategic research and technology development priorities.",
      meta: "Programmes  •  Research",
      cta: "View programme",
      className: "lg:col-span-3",
    },
    {
      title: "The Proof of Usefulness Hackathon",
      type: "program",
      image: mystartupCardImages.proofHackathon,
      alt: "Proof of Usefulness Hackathon programme image",
      summary: "A hackathon focused on actual human, technical, and financial adoption for useful products.",
      meta: "Programmes  •  Hackathon",
      cta: "Join challenge",
      className: "lg:col-span-3",
    },
  ],
};
