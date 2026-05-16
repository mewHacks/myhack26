export type GalleryItem = {
  src: string;
  alt: string;
  label: string;
};

export type AudiencePageContent = {
  slug: "startup" | "investors" | "mentors";
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  highlights: string[];
  sections: Array<{
    title: string;
    body: string;
  }>;
  gallery: GalleryItem[];
};

export const audiencePages: Record<AudiencePageContent["slug"], AudiencePageContent> = {
  startup: {
    slug: "startup",
    eyebrow: "For teams",
    title: "",
    summary:
      "A placeholder page for teams collecting proof points, milestones, and pitch-ready messaging.",
    description:
      "Use this page to clarify what founders are working on, what help they need, and what success looks like before the event starts.",
    heroImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    heroAlt: "",
    highlights: ["Problem framing", "Pitch practice", "Demo planning"],
    sections: [
      {
        title: "What this page can hold",
        body:
          "Keep a practical list of milestones, judging expectations, and the first resources founders should open.",
      },
      {
        title: "Why it matters",
        body:
          "A focused startup page reduces confusion and helps teams spend more time building instead of searching for missing updates.",
      },
      {
        title: "Good first content",
        body:
          "Add timelines, submission details, pitch requirements, and a short checklist for product, story, and execution.",
      },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
        alt: "People working with laptops",
        label: "Team work",
      },
      {
        src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
        alt: "Small product meeting",
        label: "Product review",
      },
      {
        src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
        alt: "Presentation in a modern office",
        label: "Story rehearsal",
      },
    ],
  },
  investors: {
    slug: "investors",
    eyebrow: "For capital partners",
    title: "",
    summary:
      "A placeholder page for scanning teams, comparing themes, and surfacing opportunities fast.",
    description:
      "Use this page to explain the event thesis, show participating teams, and provide a clean place to review products and follow-up notes.",
    heroImage:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80",
    heroAlt: "",
    highlights: ["Deal flow view", "Team snapshots", "Follow-up notes"],
    sections: [
      {
        title: "What this page can hold",
        body:
          "Feature a curated list of teams, a short description of market themes, and clear paths for post-event follow-up.",
      },
      {
        title: "Why it matters",
        body:
          "Investors should be able to scan quickly, compare clearly, and decide where to spend time without visual noise.",
      },
      {
        title: "Good first content",
        body:
          "Add company one-liners, sector tags, stage notes, and essential links to decks, demos, or founder contact details.",
      },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
        alt: "Meeting table with discussion in progress",
        label: "Team discussions",
      },
      {
        src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
        alt: "Handshake after a meeting",
        label: "Warm introductions",
      },
      {
        src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
        alt: "Financial planning on a desk",
        label: "Evaluation notes",
      },
    ],
  },
  mentors: {
    slug: "mentors",
    eyebrow: "For coaches",
    title: "",
    summary:
      "A placeholder page for mentors supporting product, design, engineering, and market-facing decisions.",
    description:
      "Use this page to describe office hours, topic areas, scheduling, and what kind of help founders can expect throughout the program.",
    heroImage:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    heroAlt: "",
    highlights: ["Office hours", "Tactical feedback", "Founder support"],
    sections: [
      {
        title: "What this page can hold",
        body:
          "List mentor profiles, areas of expertise, office-hour formats, and the best ways for teams to request targeted help.",
      },
      {
        title: "Why it matters",
        body:
          "Mentors can move faster when teams know who to approach for product questions, technical tradeoffs, or messaging review.",
      },
      {
        title: "Good first content",
        body:
          "Add session windows, planning prompts, and a simple expectation that advice should stay concrete, short, and usable.",
      },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
        alt: "Workshop discussion around a laptop",
        label: "Working session",
      },
      {
        src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
        alt: "Team reviewing notes on a wall",
        label: "Feedback review",
      },
      {
        src: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80",
        alt: "One-on-one coaching conversation",
        label: "Direct guidance",
      },
    ],
  },
};
