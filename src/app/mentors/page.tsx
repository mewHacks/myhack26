import type { Metadata } from "next";

import { AudiencePage } from "@/components/audience-page";
import { audiencePages } from "@/lib/page-content";

export const metadata: Metadata = {
  title: "Guidance Page | Covalent",
  description: "Audience page for coaching and support.",
};

export default function MentorsPage() {
  return <AudiencePage page={audiencePages.mentors} />;
}
