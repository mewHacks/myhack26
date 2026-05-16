export type ActorType = "founder" | "mentor" | "investor";

export type FounderProfile = {
  id: string;
  type: "founder";
  name: string;
  company: string;
  sector: string[];
  stage: "pre-seed" | "seed" | "series-a";
  geography: string;
  remote_friendly: boolean;
  looking_for: string[];
  description: string;
  traction: string;
  image: string;
  imageAlt: string;
};

export type MentorProfile = {
  id: string;
  type: "mentor";
  name: string;
  expertise: string[];
  stage_preference: string[];
  geography: string;
  remote_friendly: boolean;
  availability: "high" | "medium" | "low";
  past_outcomes: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type InvestorProfile = {
  id: string;
  type: "investor";
  name: string;
  fund: string;
  thesis: string[];
  stage: string[];
  geography: string[];
  check_size: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type ActorProfile = FounderProfile | MentorProfile | InvestorProfile;

export const mockFounders: FounderProfile[] = [
  {
    id: "founder-aisha",
    type: "founder",
    name: "Aisha Razak",
    company: "PayChain",
    sector: ["fintech", "b2b-saas", "payments"],
    stage: "seed",
    geography: "Kuala Lumpur",
    remote_friendly: true,
    looking_for: ["fintech-mentor", "seed-investor", "gtm-strategy"],
    description:
      "Building embedded payment infrastructure for SMEs in SEA. 3 paying pilot customers, RM 180K ARR. Need help with investor narrative and regional expansion strategy.",
    traction: "3 pilots, RM 180K ARR, 40% MoM growth",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Founder working at a desk",
  },
  {
    id: "founder-daniel",
    type: "founder",
    name: "Daniel Lim",
    company: "MedSync",
    sector: ["healthtech", "b2b-saas", "ai"],
    stage: "pre-seed",
    geography: "Penang",
    remote_friendly: true,
    looking_for: ["healthtech-mentor", "pre-seed-investor", "product-strategy"],
    description:
      "AI-powered patient record synchronisation across Malaysian private clinics. Currently in closed beta with 2 clinics. Looking for product and go-to-market guidance before public launch.",
    traction: "2 beta clinics, 500 patient records synced/day",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Startup team working together",
  },
  {
    id: "founder-priya",
    type: "founder",
    name: "Priya Nair",
    company: "SkillLoop",
    sector: ["edtech", "b2c", "ai"],
    stage: "pre-seed",
    geography: "Johor Bahru",
    remote_friendly: false,
    looking_for: ["edtech-mentor", "b2c-growth", "pre-seed-investor"],
    description:
      "Personalised upskilling platform for fresh graduates in Malaysia. AI generates a learning roadmap based on job market gaps. 1,200 free users, testing premium at RM 29/month.",
    traction: "1,200 users, 18% weekly active, 4.4/5 app rating",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Founder presenting on stage",
  },
];

export const mockMentors: MentorProfile[] = [
  {
    id: "mentor-james",
    type: "mentor",
    name: "James Foo",
    expertise: ["fintech", "payments", "b2b-saas", "fundraising"],
    stage_preference: ["pre-seed", "seed"],
    geography: "Kuala Lumpur",
    remote_friendly: true,
    availability: "high",
    past_outcomes: "Mentored 9 fintech startups; 3 raised Series A. Avg mentor rating: 4.6/5.",
    description:
      "Ex-VP Product at a regional payments unicorn. Deep knowledge of SEA fintech regulation, PSP integrations, and enterprise sales cycles. Strong fundraising network in KL and Singapore.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Mentor leading a workshop discussion",
  },
  {
    id: "mentor-sarah",
    type: "mentor",
    name: "Sarah Tan",
    expertise: ["healthtech", "product-strategy", "clinical-workflows", "ai"],
    stage_preference: ["pre-seed", "seed"],
    geography: "Penang",
    remote_friendly: true,
    availability: "medium",
    past_outcomes: "5 healthtech mentorships; 2 companies secured MOH pilot contracts. Avg: 4.4/5.",
    description:
      "Former Chief Medical Officer turned product advisor. Specialises in navigating Malaysian healthcare regulation and hospital procurement. Helps founders translate clinical needs into product specs.",
    image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Mentor in a one-on-one coaching session",
  },
  {
    id: "mentor-raj",
    type: "mentor",
    name: "Raj Pillai",
    expertise: ["gtm-strategy", "b2c-growth", "user-acquisition", "edtech"],
    stage_preference: ["pre-seed", "seed"],
    geography: "Kuala Lumpur",
    remote_friendly: true,
    availability: "high",
    past_outcomes: "8 consumer startups mentored; avg 3.2x MAU growth within 6 months. Avg: 4.5/5.",
    description:
      "Growth practitioner who scaled two Malaysian consumer apps to 500K+ users. Expert in referral loops, local influencer playbooks, and Southeast Asian social media channels. Also has edtech experience.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Mentor in a team conversation",
  },
  {
    id: "mentor-mei",
    type: "mentor",
    name: "Mei Lin Chong",
    expertise: ["investor-narrative", "pitch-coaching", "b2b-saas", "product"],
    stage_preference: ["pre-seed", "seed", "series-a"],
    geography: "Kuala Lumpur",
    remote_friendly: true,
    availability: "medium",
    past_outcomes: "12 pitch coaching sessions; 9 founders raised within 3 months. Avg: 4.8/5.",
    description:
      "Ex-VC analyst turned founder coach. Specialises in tightening investor narratives, building financial models, and preparing for due diligence. Works across sectors but strongest in B2B SaaS.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Mentor reviewing notes with a team",
  },
];

export const mockInvestors: InvestorProfile[] = [
  {
    id: "investor-northstar",
    type: "investor",
    name: "Northstar Capital",
    fund: "Northstar Capital",
    thesis: ["fintech", "b2b-saas", "payments", "ai"],
    stage: ["seed", "series-a"],
    geography: ["Malaysia", "Singapore", "Indonesia"],
    check_size: "RM 500K – RM 2M",
    description:
      "Operators-first fund backing technical founders building B2B infrastructure in SEA. Strong preference for revenue-generating companies with clear enterprise wedge. Portfolio includes 3 fintech exits.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Investors talking across a meeting table",
  },
  {
    id: "investor-greenlight",
    type: "investor",
    name: "Greenlight Ventures",
    fund: "Greenlight Ventures",
    thesis: ["ai", "healthtech", "deep-tech", "b2b-saas"],
    stage: ["pre-seed", "seed"],
    geography: ["Malaysia", "Global"],
    check_size: "RM 200K – RM 800K",
    description:
      "Early-stage fund with deep tech focus. Backs founders at pre-product or early traction stage. Particularly interested in AI applied to regulated industries: health, finance, and legal. Remote-friendly portfolio.",
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Handshake after a startup meeting",
  },
  {
    id: "investor-orbit",
    type: "investor",
    name: "Orbit Seed",
    fund: "Orbit Seed",
    thesis: ["b2c", "edtech", "consumer-tech", "marketplace"],
    stage: ["pre-seed", "seed"],
    geography: ["Malaysia", "SEA"],
    check_size: "RM 150K – RM 600K",
    description:
      "Consumer-focused seed fund. Moves fast on teams with strong user traction and clear retention signals. Edtech, marketplace, and social commerce are current focus areas. Founder-friendly terms.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Investor notes on financial planning documents",
  },
];

export const allProfiles: ActorProfile[] = [
  ...mockFounders,
  ...mockMentors,
  ...mockInvestors,
];

export function findProfile(id: string): ActorProfile | undefined {
  return allProfiles.find((p) => p.id === id);
}

export function getCandidatesFor(viewer: ActorProfile): ActorProfile[] {
  if (viewer.type === "founder") {
    return [...mockMentors, ...mockInvestors];
  }
  if (viewer.type === "mentor") {
    return mockFounders;
  }
  // investor sees founders
  return mockFounders;
}
