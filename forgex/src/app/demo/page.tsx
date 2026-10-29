import type { Metadata } from "next";
import Link from "next/link";
import { SkillCardView } from "@/components/skill-card";
import type { CardData } from "@/lib/card";

export const metadata: Metadata = {
  title: "How it works",
  description: "A sample ForgeX Skill Card: what a student can ship in one hour, with how much each skill has been proven.",
};

// The sample card from Dev Guide §8.
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
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="text-sm font-semibold text-ember-dark">Sample Skill Card</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Your degree is one skill. This shows the rest.</h1>
        <ol className="mt-6 space-y-4 text-ink-soft">
          <li><strong className="text-ink">Every skill names its 1-hour test</strong> — a concrete task you could finish in an hour.</li>
          <li><strong className="text-ink">Every skill shows its trust tier</strong> — Claimed, Evidence found, or Verified by a BEC mentor.</li>
          <li><strong className="text-ink">No GPA, no college name.</strong> Your institute is revealed only after you and a founder both accept a match.</li>
          <li><strong className="text-ink">One link</strong> for WhatsApp, LinkedIn or a PDF — it replaces the resume.</li>
        </ol>
        <Link href="/start?role=student" className="btn-primary mt-8">Build mine</Link>
      </div>
      <SkillCardView data={SAMPLE} />
    </div>
  );
}
