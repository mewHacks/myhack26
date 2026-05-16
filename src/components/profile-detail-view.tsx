"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState, type FormEvent } from "react";

import { BrandMark } from "@/components/brand-mark";
import { OpportunityHistoryTree } from "@/components/opportunity-history-tree";
import { HeaderActions } from "@/components/ui/header-actions";
import NavHeader from "@/components/ui/nav-header";
import { headerLinks, type HistoryGroup } from "@/lib/browse-page-content";

export type ProfileRouteData = {
  name: string;
  label: string;
  description: string;
  image?: string;
  imageAlt?: string;
  meta: string[];
  graphGroups: HistoryGroup[];
};

const googleRouteColors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileDetailView({ profile }: { profile: ProfileRouteData }) {
  const reducedMotion = useReducedMotion();
  const [collaborationOpen, setCollaborationOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  function submitCollaborationRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestSent(true);
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-6 sm:px-10 lg:px-12 lg:py-10">
      {!reducedMotion ? (
        <motion.div
          aria-hidden="true"
          animate={{ opacity: [1, 1, 0] }}
          className="pointer-events-none fixed inset-0 z-50 grid grid-cols-4 overflow-hidden bg-white"
          initial={{ opacity: 1 }}
          transition={{ delay: 0.72, duration: 0.32, ease: "easeOut" }}
        >
          {googleRouteColors.map((color, index) => (
            <motion.span
              key={color}
              animate={{ y: index % 2 === 0 ? "-102%" : "102%" }}
              className="h-full w-full"
              initial={{ y: 0 }}
              style={{ backgroundColor: color }}
              transition={{ delay: 0.18 + index * 0.055, duration: 0.66, ease: [0.83, 0, 0.17, 1] }}
            />
          ))}

          <motion.div
            animate={{ opacity: [0, 1, 1, 0], scale: [0.86, 1, 1, 0.92] }}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-foreground shadow-2xl"
            initial={{ opacity: 0, scale: 0.86 }}
            transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
          >
            Opening profile
          </motion.div>
        </motion.div>
      ) : null}

      <motion.header
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-line bg-card px-5 py-3"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -18 }}
        transition={{ delay: 0.58, duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href="/" className="text-lg leading-none">
          <BrandMark />
        </Link>

        <div className="flex items-center justify-self-center gap-3">
          <span className="text-lg font-medium text-foreground sm:text-xl">I&apos;m a</span>
          <NavHeader items={headerLinks} />
        </div>

        <HeaderActions />
      </motion.header>

      <motion.section
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        className="relative overflow-hidden rounded-[1.75rem] border border-line bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_52%,rgba(66,133,244,0.16)_100%)] p-4 sm:p-6"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94, y: 42 }}
        transition={{ delay: 0.72, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, rotateX: 0, rotateY: 0, scale: 1, y: 0 }}
            className="flex min-h-80 items-center justify-center rounded-[1.75rem] border border-line bg-card p-8 shadow-[inset_-120px_0_140px_rgba(66,133,244,0.08)] [transform-style:preserve-3d]"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, rotateX: -16, rotateY: 10, scale: 0.86, y: 52 }}
            transition={{ delay: 0.86, type: "spring", stiffness: 150, damping: 16, mass: 0.78 }}
          >
            <div className="relative h-44 w-44 overflow-hidden rounded-full border border-line bg-white shadow-xl sm:h-56 sm:w-56">
              {profile.image ? (
                <Image src={profile.image} alt={profile.imageAlt ?? profile.name} fill sizes="224px" className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-5xl font-semibold text-foreground">
                  {initials(profile.name)}
                </span>
              )}
            </div>
          </motion.div>

          <motion.article
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
            className="relative flex flex-col justify-center overflow-hidden rounded-[1.75rem] border border-line bg-card p-6 sm:p-8"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 42, scale: 0.96 }}
            transition={{ delay: 0.98, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex w-fit rounded-full bg-[var(--color-google-blue-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-google-blue)]">
              {profile.label}
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">{profile.name}</h1>
            <p className="mt-5 text-base leading-8 text-muted sm:text-lg">{profile.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {profile.meta.map((item) => (
                <span key={item} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setRequestSent(false);
                  setCollaborationOpen(true);
                }}
                className="rounded-full bg-[var(--color-google-blue)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Request collaboration
              </button>
              <button
                type="button"
                onClick={() => {
                  setRequestSent(false);
                  setCollaborationOpen(true);
                }}
                className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/10"
              >
                Open chat
              </button>
            </div>
          </motion.article>
        </div>
      </motion.section>

      <motion.section
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        className="rounded-[1.75rem] border border-line bg-white/90 p-6 shadow-[0_18px_54px_rgba(60,64,67,0.08)] sm:p-8"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
        transition={{ delay: 1.08, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Opportunity graph</p>
        <OpportunityHistoryTree groups={profile.graphGroups} mode="detail" />
      </motion.section>

      {collaborationOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 px-4 py-6 backdrop-blur-sm sm:items-center">
          <motion.aside
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-2xl"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 32, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 180, damping: 20, mass: 0.78 }}
          >
            <div className="border-b border-line bg-[linear-gradient(90deg,#ffffff_0%,rgba(66,133,244,0.12)_100%)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--color-google-blue-soft)] text-sm font-bold text-[var(--color-google-blue)]">
                    {profile.image ? (
                      <span className="relative h-full w-full">
                        <Image src={profile.image} alt="" fill sizes="44px" className="object-cover" />
                      </span>
                    ) : (
                      initials(profile.name)
                    )}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Collaboration request</p>
                    <h2 className="mt-1 text-xl font-semibold text-foreground">Chat with {profile.name}</h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCollaborationOpen(false)}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/10"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-2xl bg-muted/10 p-4 text-sm leading-6 text-muted">
                <p className="font-semibold text-foreground">Covalent assistant</p>
                <p className="mt-1">Send a concise collaboration request. We&apos;ll attach this profile context and your relationship graph.</p>
              </div>

              {requestSent ? (
                <div className="rounded-2xl border border-[var(--color-google-green-soft)] bg-[var(--color-google-green-soft)]/60 p-4">
                  <p className="text-sm font-semibold text-[var(--color-google-green)]">Request sent</p>
                  <p className="mt-1 text-sm leading-6 text-muted">Your collaboration request is ready in the chat thread for {profile.name}.</p>
                </div>
              ) : (
                <form className="space-y-3" onSubmit={submitCollaborationRequest}>
                  <select className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-google-blue)]" defaultValue="">
                    <option value="" disabled>
                      Request type
                    </option>
                    <option>Investor intro</option>
                    <option>Mentorship</option>
                    <option>Programme collaboration</option>
                    <option>Partnership</option>
                  </select>
                  <textarea
                    required
                    className="min-h-32 w-full rounded-xl border border-line px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-google-blue)]"
                    placeholder={`Write a short note to ${profile.name}...`}
                  />
                  <button type="submit" className="w-full rounded-full bg-[var(--color-google-blue)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                    Send request
                  </button>
                </form>
              )}
            </div>
          </motion.aside>
        </div>
      ) : null}
    </main>
  );
}
