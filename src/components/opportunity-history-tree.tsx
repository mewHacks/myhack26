"use client";

import Image from "next/image";
import Link from "next/link";

import { getProfileSlug, type HistoryEntry, type HistoryGroup } from "@/lib/browse-page-content";

type OpportunityHistoryTreeProps = {
  groups: HistoryGroup[];
  mode?: "preview" | "tooltip" | "detail";
};

const branchDots = ["bg-[var(--color-google-blue)]", "bg-[var(--color-google-yellow)]", "bg-[var(--color-google-green)]"];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const supplementalConnections: HistoryEntry[] = [
  {
    name: "Cradle Fund",
    label: "backed by",
    avatar: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Devoteam",
    label: "worked with",
    avatar: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "42KL",
    label: "talent partner",
    avatar: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "GDGKL",
    label: "community",
    avatar: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "MYStartup",
    label: "ecosystem",
    avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "MDEC",
    label: "digital economy",
    avatar: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=160&q=80",
  },
];

function getSeed(name: string) {
  return name.split("").reduce((total, character) => total + character.charCodeAt(0), 0);
}

function getConnections(entry: HistoryEntry, includeSupplemental = true) {
  const existing = entry.children ?? [];
  if (!includeSupplemental || existing.length >= 4) return existing;

  const start = getSeed(entry.name) % supplementalConnections.length;
  const additions = supplementalConnections
    .slice(start)
    .concat(supplementalConnections.slice(0, start))
    .filter((connection) => !existing.some((child) => child.name === connection.name))
    .slice(0, 4 - existing.length);

  return [...existing, ...additions];
}

function Avatar({ name, avatar, size = "sm" }: { name: string; avatar?: string; size?: "sm" | "lg" }) {
  const sizeClass = size === "lg" ? "h-24 w-24 sm:h-28 sm:w-28" : "h-8 w-8";
  const textClass = size === "lg" ? "text-2xl sm:text-3xl" : "text-[10px]";

  if (!avatar) {
    return (
      <span className={`${sizeClass} ${textClass} inline-flex shrink-0 items-center justify-center rounded-full bg-white font-semibold text-foreground ring-1 ring-line`}>
        {initials(name)}
      </span>
    );
  }

  return (
    <span className={`${sizeClass} relative inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-white`}>
      <Image src={avatar} alt="" fill sizes={size === "lg" ? "112px" : "32px"} className="object-cover" />
    </span>
  );
}

function profileHref(name: string) {
  return `/profiles/${getProfileSlug(name)}`;
}

function DetailProfileLink({ entry, size = "sm" }: { entry: HistoryEntry; size?: "sm" | "lg" }) {
  const textClass = size === "lg" ? "mt-3 max-w-32 text-base sm:text-lg" : "mt-2 max-w-20 text-xs";
  const labelClass = size === "lg" ? "mt-1 max-w-32 text-sm" : "max-w-20 text-[11px]";

  return (
    <Link
      href={profileHref(entry.name)}
      className="group flex flex-col items-center text-center outline-none transition hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
    >
      <Avatar name={entry.name} avatar={entry.avatar} size={size} />
      <p className={`${textClass} truncate font-semibold text-foreground transition group-hover:text-[var(--color-google-blue)] group-focus-visible:text-[var(--color-google-blue)]`}>
        {entry.name}
      </p>
      {entry.label ? <p className={`${labelClass} truncate text-muted`}>{entry.label}</p> : null}
    </Link>
  );
}

function DetailNode({ entry, depth = 0 }: { entry: HistoryEntry; depth?: number }) {
  const connections = getConnections(entry, depth === 0);
  const canRecurse = depth < 3;

  return (
    <div className="flex min-w-[8rem] flex-col items-center text-center">
      <DetailProfileLink entry={entry} size={depth === 0 ? "lg" : "sm"} />

      {connections.length ? (
        <div className="mt-5 flex max-w-80 flex-wrap justify-center gap-x-4 gap-y-5">
          {connections.map((child) => (
            child.children?.length && canRecurse ? (
              <DetailNode key={child.name} entry={child} depth={depth + 1} />
            ) : (
              <DetailProfileLink key={child.name} entry={child} />
            )
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function OpportunityHistoryTree({ groups, mode = "preview" }: OpportunityHistoryTreeProps) {
  if (mode === "preview") {
    return (
      <div className="mt-3 space-y-3 rounded-[1.5rem] border border-line bg-white/95 px-5 py-5 shadow-[0_16px_40px_rgba(60,64,67,0.08)]">
        {groups.slice(0, 3).map((group, index) => (
          <div key={group.title} className="grid grid-cols-[7rem_1fr] items-center gap-4 text-sm">
            <div className="flex items-center gap-2.5 font-semibold text-foreground/80">
              <span className={`h-2.5 w-2.5 rounded-full ${branchDots[index % branchDots.length]}`} />
              {group.title}
            </div>
            <div className="flex min-w-0 items-center justify-end gap-2">
              {group.entries.some((entry) => entry.avatar) ? (
                <div className="flex -space-x-2.5">
                  {group.entries.slice(0, 3).map((entry) => (
                    <Link key={entry.name} href={profileHref(entry.name)} className="rounded-full outline-none transition hover:-translate-y-0.5 focus-visible:-translate-y-0.5">
                      <Avatar name={entry.name} avatar={entry.avatar} />
                    </Link>
                  ))}
                </div>
              ) : (
                <span className="truncate rounded-full bg-black/[0.04] px-3 py-1.5 text-sm font-medium text-muted">
                  {group.entries[0]?.name}
                </span>
              )}
              {group.entries.length > 3 ? <span className="font-semibold text-muted">+{group.entries.length - 3}</span> : null}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (mode === "detail") {
    return (
      <div className="space-y-14 bg-white px-2 py-4 sm:px-4 sm:py-6">
        {groups.map((group) => (
          <section key={group.title} className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">{group.title}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-12 gap-y-10">
              {group.entries.map((entry) => (
                <DetailNode key={entry.name} entry={entry} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="relative space-y-3">
      {groups.map((group, index) => (
        <div key={group.title} className="relative pl-5">
          <span className={`absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full ${branchDots[index % branchDots.length]}`} />
          {index < groups.length - 1 ? <span className="absolute left-[4px] top-5 h-[calc(100%-0.25rem)] w-px bg-line" /> : null}
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{group.title}</p>
          <div className="mt-2 space-y-2">
            {group.entries.map((entry) => (
              <Link key={entry.name} href={profileHref(entry.name)} className="flex items-center gap-4 rounded-[1.5rem] bg-black/[0.035] px-4 py-4 transition hover:-translate-y-0.5 hover:bg-black/[0.055] focus-visible:-translate-y-0.5 focus-visible:outline-none">
                <Avatar name={entry.name} avatar={entry.avatar} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{entry.name}</p>
                  {entry.label ? <p className="truncate text-xs text-muted">{entry.label}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
