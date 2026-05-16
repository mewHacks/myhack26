import type { Metadata } from "next";

import { AudienceBrowsePage } from "@/components/audience-browse-page";
import { browsePages, browsePageThemes } from "@/lib/browse-page-content";

export const metadata: Metadata = {
  title: "Mentors | Covalent",
  description: "Browse mentor opportunities, startup requests, and support programs in one place.",
};

export default function MentorsPage() {
  return <AudienceBrowsePage opportunities={browsePages.mentors} theme={browsePageThemes.mentors} />;
}
