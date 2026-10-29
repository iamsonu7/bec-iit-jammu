"use client";

import Link from "next/link";
import { useState } from "react";

const TRACKS = {
  student: {
    label: "I have a skill",
    cta: { href: "/start?role=student", text: "Build my Skill Card" },
    steps: [
      { t: "Pick your skills", b: "Choose from 40+ skills across every discipline. Up to eight." },
      { t: "Answer the Skill Vault", b: "Three or four precise questions per skill. Under 90 seconds each. No essays." },
      { t: "Share your Skill Card", b: "One link for WhatsApp or LinkedIn, or export a PDF. It replaces the resume." },
      { t: "Express interest", b: "Browse ideas ranked by how well they match you. Tell the founder what you'd do in your first hour." },
    ],
  },
  founder: {
    label: "I have an idea",
    cta: { href: "/start?role=founder", text: "Post an idea" },
    steps: [
      { t: "Post your idea", b: "What you're building, its stage, and what you offer: paid, equity or learning." },
      { t: "Tag the skills", b: "Mark each skill as must-have or nice-to-have. Any discipline." },
      { t: "Review Skill Cards", b: "Interested students arrive with their skills, tiers and proof — not their college name." },
      { t: "Accept and connect", b: "Accept someone and you both see each other's contact. No chat to moderate, no spam." },
    ],
  },
} as const;

type Track = keyof typeof TRACKS;

export function Journeys() {
  const [track, setTrack] = useState<Track>("student");
  const t = TRACKS[track];

  return (
    <div className="mt-12">
      <div role="tablist" aria-label="Choose your side" className="inline-flex rounded-xl bg-paper p-1.5 ring-1 ring-line">
        {(Object.keys(TRACKS) as Track[]).map((k) => (
          <button
            key={k}
            role="tab"
            id={`tab-${k}`}
            aria-selected={track === k}
            aria-controls="journey-panel"
            onClick={() => setTrack(k)}
            className={`rounded-lg px-5 py-2.5 font-sub text-sm font-semibold transition ${track === k ? "bg-navy text-white shadow" : "text-ink-soft hover:text-navy"}`}
          >
            {TRACKS[k].label}
          </button>
        ))}
      </div>

      <div id="journey-panel" role="tabpanel" aria-labelledby={`tab-${track}`} className="mt-10">
        <ol key={track} className="grid gap-5 md:grid-cols-4">
          {t.steps.map((s, i) => (
            <li key={s.t} className="relative animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-navy font-display text-lg font-bold text-white">{i + 1}</span>
                {i < t.steps.length - 1 && <span className="hidden h-px flex-1 border-t-2 border-dashed border-sky/60 md:block" aria-hidden />}
              </div>
              <h3 className="mt-5 text-xl font-bold text-charcoal">{s.t}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{s.b}</p>
            </li>
          ))}
        </ol>
        <Link href={t.cta.href} className="btn-primary mt-10">{t.cta.text} <span aria-hidden>→</span></Link>
      </div>
    </div>
  );
}
