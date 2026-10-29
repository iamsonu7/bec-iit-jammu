import type { Metadata } from "next";
import Link from "next/link";
import { SkillCardView } from "@/components/skill-card";
import { PageHeader } from "@/components/page-header";
import type { CardData } from "@/lib/card";

export const metadata: Metadata = {
  title: "How it works",
  description: "A sample Forge 360 Skill Card: what a student can ship in one hour, with how much each skill has been proven.",
};

// The sample card from the product guide.
const SAMPLE: CardData = {
  card: {
    user_id: "demo",
    handle: "aarav_edits",
    name: "Aarav Sharma",
    headline: "I can ship a launch reel and its captions in an afternoon.",
    availability: "now",
    hours_per_week: 6,
    comp_pref: ["paid", "equity"],
    wants_fields: ["health", "edtech", "fashion"],
    bio: null,
  },
  skills: [
    {
      id: "1", skill_id: "video-editing", tier: "T2",
      skills: { id: "video-editing", name: "Video editing", category: "Content", one_hour_test: "cut a 60-second reel from raw footage" },
      answers_json: { q1: ["Premiere Pro", "CapCut"], q3: "Yes", q4: { choice: "Yes" } },
      evidence: [{ url: "https://youtube.com/@example" }, { url: "https://instagram.com/example" }, { url: "https://drive.google.com/example" }],
    },
    {
      id: "2", skill_id: "legal-drafting", tier: "T1",
      skills: { id: "legal-drafting", name: "Legal drafting", category: "Law", one_hour_test: "draft a two-page founder–contributor agreement or NDA" },
      answers_json: { q1: ["Google Docs"], q3: "With help", q4: { choice: "No" } },
      evidence: [{ url: "https://example.com/portfolio" }],
    },
    {
      id: "3", skill_id: "excel-modelling", tier: "T0",
      skills: { id: "excel-modelling", name: "Excel modelling", category: "Finance", one_hour_test: "build a 12-month revenue and cost model with three scenarios" },
      answers_json: { q1: ["Excel", "Pivot tables"], q3: "Yes", q4: { choice: "No" } },
      evidence: [],
    },
  ],
};

export default function Demo() {
  return (
    <>
      <PageHeader eyebrow="Sample Skill Card" title={<>Your degree is one skill.<br className="hidden sm:block" /> This shows the rest.</>}>
        A real Skill Card, readable in ten seconds. Every claim says how much it&apos;s been proven.
      </PageHeader>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <ol className="space-y-6 lg:pt-4">
          {[
            ["The 1-hour test", "Each skill names a concrete task you could finish in an hour — and whether you can do it today."],
            ["The trust tier", "Claimed, Evidence found, or Verified by a mentor. Founders see what's been checked."],
            ["No GPA, no college name", "Your institute appears only after you and a founder both accept a match."],
            ["One link", "Share it on WhatsApp or LinkedIn with a clean preview, or export a PDF. It replaces the resume."],
          ].map(([t, b], i) => (
            <li key={t} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy font-display text-base font-bold text-white">{i + 1}</span>
              <div>
                <h2 className="text-xl font-bold text-charcoal">{t}</h2>
                <p className="mt-1 leading-relaxed text-ink-soft">{b}</p>
              </div>
            </li>
          ))}
          <li className="pt-2">
            <Link href="/start?role=student" className="btn-primary">Build mine — about 5 minutes <span aria-hidden>→</span></Link>
          </li>
        </ol>
        <SkillCardView data={SAMPLE} />
      </div>
    </>
  );
}
