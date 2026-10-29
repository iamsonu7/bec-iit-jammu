import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireViewer } from "@/lib/session";
import { COMP_LABEL, IDEA_SELECT, STAGE_LABEL, matchScore, mySkillIds } from "@/lib/ideas";
import { FIELDS, type Idea } from "@/lib/types";

export const metadata: Metadata = { title: "Ideas" };

type Search = Promise<{ field?: string; comp?: string }>;

export default async function IdeasPage({ searchParams }: { searchParams: Search }) {
  const viewer = await requireViewer("/ideas");
  const { field, comp } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("ideas").select(IDEA_SELECT).eq("status", "open").order("created_at", { ascending: false }).limit(100);
  if (field && (FIELDS as readonly string[]).includes(field)) query = query.eq("field", field);
  if (comp && comp in COMP_LABEL) query = query.eq("comp_type", comp);

  const [{ data }, mine] = await Promise.all([query, mySkillIds(supabase, viewer.id)]);
  const ideas = ((data ?? []) as unknown as Idea[])
    .map((idea) => ({ idea, match: matchScore(idea, mine) }))
    .sort((a, b) => b.match.pct - a.match.pct);

  const filterHref = (k: "field" | "comp", v?: string) => {
    const p = new URLSearchParams();
    const next = { field, comp, [k]: v };
    if (next.field) p.set("field", next.field);
    if (next.comp) p.set("comp", next.comp);
    return `/ideas${p.size ? `?${p}` : ""}`;
  };
  const pill = (on: boolean) => `chip shrink-0 capitalize ${on ? "!border-ink bg-ink text-white" : "hover:border-ink-soft"}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ideas</h1>
          <p className="mt-1 text-ink-soft">Ideas that need real execution. {mine.size > 0 ? "Best matches for your skills first." : ""}</p>
        </div>
        <Link href="/onboarding/founder" className="btn-ghost">Post an idea</Link>
      </div>

      {mine.size === 0 && (
        <p className="mt-6 rounded-xl bg-ember-soft px-4 py-3 text-sm text-ember-dark">
          <Link href="/onboarding/student" className="font-semibold underline">Build your Skill Card</Link> to see which ideas match you and to express interest.
        </p>
      )}

      <nav aria-label="Filters" className="mt-6 space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Link href={filterHref("field")} className={pill(!field)}>All fields</Link>
          {FIELDS.map((f) => <Link key={f} href={filterHref("field", f)} className={pill(field === f)}>{f}</Link>)}
        </div>
        <div className="flex gap-2">
          <Link href={filterHref("comp")} className={pill(!comp)}>Any offer</Link>
          {Object.entries(COMP_LABEL).map(([k, v]) => <Link key={k} href={filterHref("comp", k)} className={pill(comp === k)}>{v}</Link>)}
        </div>
      </nav>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {ideas.map(({ idea, match }) => (
          <li key={idea.id}>
            <Link href={`/ideas/${idea.id}`} className="panel block h-full transition-colors hover:border-ink-soft">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold leading-snug">{idea.title}</h2>
                {match.have > 0 && (
                  <span className="shrink-0 rounded-full bg-tier-t2-bg px-2.5 py-0.5 text-xs font-semibold text-tier-t2">{match.pct}% match</span>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{idea.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {idea.idea_skills.map((s) => (
                  <span key={s.skill_id} className={`chip ${mine.has(s.skill_id) ? "!border-tier-t2 !text-tier-t2" : ""} ${s.priority === "must" ? "font-semibold" : ""}`}>
                    {s.skills.name}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs capitalize text-muted">{idea.field} · {STAGE_LABEL[idea.stage]} · {COMP_LABEL[idea.comp_type]}</p>
            </Link>
          </li>
        ))}
      </ul>
      {ideas.length === 0 && <p className="mt-10 text-center text-muted">No open ideas here yet.</p>}
    </div>
  );
}
