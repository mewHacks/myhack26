import type { Metadata } from "next";

import { ProfileDetailView, type ProfileRouteData } from "@/components/profile-detail-view";
import {
  browsePages,
  defaultHistoryGroups,
  getProfileSlug,
  type HistoryEntry,
  type HistoryGroup,
} from "@/lib/browse-page-content";
import { allProfiles } from "@/lib/profiles";

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function collectEntries(groups: HistoryGroup[]): HistoryEntry[] {
  return groups.flatMap((group) =>
    group.entries.flatMap((entry) => [entry, ...(entry.children ? collectEntries([{ title: group.title, entries: entry.children }]) : [])])
  );
}

function findHistoryEntry(slug: string) {
  const groupSets = [
    ...Object.values(defaultHistoryGroups).flat(),
    ...Object.values(browsePages).flatMap((items) => items.flatMap((item) => item.historyGroups ?? [])),
  ];

  return collectEntries(groupSets).find((entry) => getProfileSlug(entry.name) === slug);
}

function graphFor(name: string, entry?: HistoryEntry): HistoryGroup[] {
  return [
    {
      title: "Connection",
      entries: [
        entry ?? {
          name,
          label: "Opportunity graph",
        },
      ],
    },
  ];
}

function findProfile(slug: string): ProfileRouteData {
  const actor = allProfiles.find((profile) => {
    const displayName = profile.type === "founder" ? profile.company : profile.name;
    return getProfileSlug(displayName) === slug || getProfileSlug(profile.name) === slug;
  });

  if (actor) {
    const displayName = actor.type === "founder" ? actor.company : actor.name;
    const graphEntry = findHistoryEntry(getProfileSlug(displayName)) ?? findHistoryEntry(getProfileSlug(actor.name));

    if (actor.type === "founder") {
      return {
        name: actor.company,
        label: "Startup profile",
        description: actor.description,
        image: actor.image,
        imageAlt: actor.imageAlt,
        meta: [actor.name, actor.stage, actor.geography, actor.traction],
        graphGroups: graphFor(actor.company, graphEntry),
      };
    }

    if (actor.type === "mentor") {
      return {
        name: actor.name,
        label: "Mentor profile",
        description: actor.description,
        image: actor.image,
        imageAlt: actor.imageAlt,
        meta: [actor.geography, actor.availability, actor.expertise.slice(0, 3).join(" • ")],
        graphGroups: graphFor(actor.name, graphEntry),
      };
    }

    return {
      name: actor.name,
      label: "Investor profile",
      description: actor.description,
      image: actor.image,
      imageAlt: actor.imageAlt,
      meta: [actor.check_size, actor.stage.join(" • "), actor.geography.join(" • ")],
      graphGroups: graphFor(actor.name, graphEntry),
    };
  }

  const entry = findHistoryEntry(slug);
  if (entry) {
    return {
      name: entry.name,
      label: entry.label ?? "Connection profile",
      description: `${entry.name} is part of this opportunity's relationship graph, linking experience, backers, operators, and ecosystem context.`,
      image: entry.avatar,
      imageAlt: entry.name,
      meta: entry.label ? [entry.label] : [],
      graphGroups: graphFor(entry.name, entry),
    };
  }

  const name = titleFromSlug(slug);
  return {
    name,
    label: "Connection profile",
    description: `${name} is part of the Covalent relationship graph for startup, mentor, investor, and programme discovery.`,
    meta: [],
    graphGroups: graphFor(name),
  };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = findProfile(slug);

  return {
    title: `${profile.name} | Covalent`,
    description: profile.description,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const profile = findProfile(slug);

  return <ProfileDetailView profile={profile} />;
}
