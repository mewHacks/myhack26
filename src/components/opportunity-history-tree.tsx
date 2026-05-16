"use client";

import Image from "next/image";

import { type HistoryGroup } from "@/lib/browse-page-content";

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

function DetailNode({ entry }: { entry: HistoryGroup["entries"][number] }) {
  return (
    <div className="flex min-w-[8rem] flex-col items-center text-center">
      <Avatar name={entry.name} avatar={entry.avatar} size="lg" />
      <p className="mt-3 max-w-32 truncate text-base font-semibold text-foreground sm:text-lg">{entry.name}</p>
      {entry.label ? <p className="mt-1 max-w-32 truncate text-sm text-muted">{entry.label}</p> : null}

      {entry.children?.length ? (
        <div className="mt-5 flex flex-col items-center">
          <span className="h-6 w-px bg-line" />
          {entry.children.length > 1 ? <span className="h-px w-32 bg-line" /> : null}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-5 pt-4">
            {entry.children.map((child) => (
              <div key={child.name} className="flex w-24 flex-col items-center text-center">
                <Avatar name={child.name} avatar={child.avatar} />
                <p className="mt-2 max-w-24 truncate text-sm font-semibold text-foreground">{child.name}</p>
                {child.label ? <p className="max-w-24 truncate text-xs text-muted">{child.label}</p> : null}
              </div>
            ))}
          </div>
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
                    <Avatar key={entry.name} name={entry.name} avatar={entry.avatar} />
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
              <div key={entry.name} className="flex items-center gap-4 rounded-[1.5rem] bg-black/[0.035] px-4 py-4">
                <Avatar name={entry.name} avatar={entry.avatar} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{entry.name}</p>
                  {entry.label ? <p className="truncate text-xs text-muted">{entry.label}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
