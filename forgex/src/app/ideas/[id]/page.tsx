import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireViewer } from "@/lib/session";
import { COMP_LABEL, IDEA_SELECT, STAGE_LABEL, matchScore, mySkillIds } from "@/lib/ideas";
import type { Idea } from "@/lib/types";
import { InterestForm } from "./interest-form";

export const metadata: Metadata = { title: "Idea" };

type Params = Promise<{ id: string }>;

export default async function IdeaPage({ params, searchParams }: { params: Params; searchParams: Promise<{ new?: string }> }) {
  const { id } = await params;
  const { new: isNew } = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const viewer = await requireViewer(`/ideas/${id}`);
  const supabase = await createClient();

  const { data } = await supabase.from("ideas").select(IDEA_SELECT).eq("id", id).maybeSingle();
  if (!data) notFound();
  const idea = data as unknown as Idea;
  const own = idea.founder_id === viewer.id;

  const [mine, { data: founder }, { data: interest }] = await Promise.all([
    mySkillIds(supabase, viewer.id),
    supabase.from("public_cards").select("handle, name").eq("user_id", idea.founder_id).maybeSingle(),
    supabase.from("interests").select("status").eq("idea_id", id).eq("student_id", viewer.id).maybeSingle(),
  ]);
  const match = matchScore(idea, mine);
  const must = idea.idea_skills.filter((s) => s.priority === "must");
  const nice = idea.idea_skills.filter((s) => s.priority === "nice");

  const skillList = (list: typeof must) => (
    <ul className="mt-2 flex flex-wrap gap-2">
      {list.map((s) => (
        <li key={s.skill_id} className={`chip !px-3 !py-1.5 !text-sm ${mine.has(s.skill_id) ? "!border-tier-t2 bg-tier-t2-bg !text-tier-t2" : ""}`}>
          {mine.has(s.skill_id) && <span aria-label="on your card" className="mr-1">✓</span>}
          {s.skills.name}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/ideas" className="text-sm text-muted hover:text-ink">← All ideas</Link>
      {own && isNew && (
        <p className="mt-4 rounded-xl bg-ember-soft px-4 py-3 text-sm text-ember-dark">
          Your idea is live. Interested students will show up on your <Link href="/dashboard" className="font-semibold underline">dashboard</Link>.
        </p>
      )}
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{idea.title}</h1>
      <p className="mt-2 text-sm capitalize text-muted">
        {idea.field} · {STAGE_LABEL[idea.stage]} · {COMP_LABEL[idea.comp_type]}
        {founder?.handle && <> · by <Link href={`/card/${founder.handle}`} className="normal-case underline-offset-2 hover:underline">@{founder.handle}</Link></>}
      </p>
      <p className="mt-6 whitespace-pre-line text-ink-soft">{idea.summary}</p>

      <section className="panel mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Skills needed</h2>
          {!own && match.have > 0 && <span className="text-sm font-semibold text-tier-t2">{match.pct}% match</span>}
        </div>
        {must.length > 0 && <><p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">Must-have</p>{skillList(must)}</>}
        {nice.length > 0 && <><p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">Nice-to-have</p>{skillList(nice)}</>}
      </section>

      <section className="mt-8">
        {own ? (
          <Link href="/dashboard" className="btn-ghost">See interested students</Link>
        ) : interest ? (
          <p className="panel text-sm">
            You expressed interest · status: <strong className="capitalize">{interest.status}</strong>.{" "}
            <Link href="/dashboard" className="underline">Track it on your dashboard</Link>.
          </p>
        ) : !viewer.roles.includes("student") ? (
          <p className="panel text-sm">
            <Link href="/onboarding/student" className="font-semibold text-ember-dark underline">Build your Skill Card</Link> to express interest.
          </p>
        ) : idea.status === "open" ? (
          <InterestForm ideaId={idea.id} />
        ) : (
          <p className="text-sm text-muted">This idea isn&apos;t taking interest right now.</p>
        )}
      </section>
    </div>
  );
}
