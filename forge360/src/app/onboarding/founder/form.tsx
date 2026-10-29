"use client";

import { useMemo, useState, useTransition } from "react";
import { BasicsFields } from "@/components/basics-fields";
import { saveFounderOnboarding, type BasicsInput, type FounderInput } from "../actions";
import { FIELDS, type Skill } from "@/lib/types";

type Priority = "must" | "nice";
type Idea = FounderInput["idea"];

export function FounderForm({
  skills,
  basicsDone,
  initial,
}: {
  skills: Pick<Skill, "id" | "name" | "category">[];
  basicsDone: boolean;
  initial: BasicsInput;
}) {
  const [basics, setBasics] = useState(initial);
  const [idea, setIdea] = useState<Idea>({ title: "", summary: "", field: "", stage: "idea", compType: "equity", skills: {} });
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((s) => !q || `${s.name} ${s.category}`.toLowerCase().includes(q));
  }, [skills, query]);

  // Tap cycles: none → must → nice → none.
  function cycle(id: string) {
    const cur = idea.skills[id];
    const next: Record<string, Priority> = { ...idea.skills };
    if (!cur) next[id] = "must";
    else if (cur === "must") next[id] = "nice";
    else delete next[id];
    setIdea({ ...idea, skills: next });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    startTransition(async () => {
      const result = await saveFounderOnboarding({ ...basics, idea });
      if (result) setError(result.error);
    });
  }

  const tagged = Object.entries(idea.skills);

  return (
    <form onSubmit={submit} className="space-y-10">
      {!basicsDone && (
        <section>
          <h2 className="mb-5 text-2xl font-bold text-charcoal">About you</h2>
          <BasicsFields value={basics} onChange={setBasics} showHeadline={false} />
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-charcoal">The idea</h2>
        <div>
          <label htmlFor="title" className="label">Title</label>
          <input id="title" className="field" required minLength={4} maxLength={90} placeholder="Vernacular legal help for small shops"
            value={idea.title} onChange={(e) => setIdea({ ...idea, title: e.target.value })} />
        </div>
        <div>
          <label htmlFor="summary" className="label">What are you building, and what&apos;s the first real task?</label>
          <textarea id="summary" className="field" required minLength={20} maxLength={1200} rows={5}
            value={idea.summary} onChange={(e) => setIdea({ ...idea, summary: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="field" className="label">Field</label>
            <select id="field" className="field capitalize" required value={idea.field} onChange={(e) => setIdea({ ...idea, field: e.target.value })}>
              <option value="">Choose…</option>
              {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="stage" className="label">Stage</label>
            <select id="stage" className="field" value={idea.stage} onChange={(e) => setIdea({ ...idea, stage: e.target.value as Idea["stage"] })}>
              <option value="idea">Just an idea</option>
              <option value="prototype">Prototype</option>
              <option value="launched">Launched</option>
            </select>
          </div>
          <div>
            <label htmlFor="comp" className="label">You offer</label>
            <select id="comp" className="field" value={idea.compType} onChange={(e) => setIdea({ ...idea, compType: e.target.value as Idea["compType"] })}>
              <option value="paid">Paid work</option>
              <option value="equity">Equity</option>
              <option value="learning">Learning / credit</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-charcoal">Skills needed</h2>
        <p className="mb-4 mt-1 text-sm text-ink-soft">
          Tap once for <strong className="text-navy">must-have</strong>, twice for <strong className="text-tier-t1">nice-to-have</strong>, again to remove.
        </p>
        <input type="search" placeholder="Search skills" aria-label="Search skills" className="field mb-4" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {visible.map((s) => {
            const p = idea.skills[s.id];
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => cycle(s.id)}
                aria-label={`${s.name}${p ? `, ${p === "must" ? "must-have" : "nice-to-have"}` : ""}`}
                className={`chip !px-4 !py-2 !text-sm ${p === "must" ? "chip-on" : p === "nice" ? "!border-tier-t1 bg-tier-t1-bg !text-tier-t1" : "hover:border-ink-soft"}`}
              >
                {s.name}
                {p && <span className="ml-1.5 text-[10px] uppercase opacity-80">{p}</span>}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted">{tagged.length} tagged · {tagged.filter(([, p]) => p === "must").length} must-have</p>
      </section>

      {error && <p role="alert" className="alert">{error}</p>}
      <button className="btn-primary w-full sm:w-auto" disabled={pending}>{pending ? "Posting…" : "Post idea"}</button>
    </form>
  );
}
