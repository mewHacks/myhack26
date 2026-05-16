import type { Metadata } from "next";

import { AudiencePage } from "@/components/audience-page";
import { audiencePages } from "@/lib/page-content";

export const metadata: Metadata = {
  title: "Team Page | Covalent",
  description: "Audience page for project teams.",
};

export default function StartupPage() {
  return <AudiencePage page={audiencePages.startup} />;
}
