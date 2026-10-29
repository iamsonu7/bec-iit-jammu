"use client";

import { useMemo, useState, useTransition } from "react";
import { BasicsFields } from "@/components/basics-fields";
import { SkillQuestionInput } from "@/components/skill-question";
import { saveStudentOnboarding, type StudentInput } from "../actions";
import { FIELDS } from "@/lib/types";
import type { VaultSkill } from "@/lib/vault";

const MAX_SKILLS = 8;
const STEPS = ["About you", "Availability", "Pick skills", "Skill Vault"] as const;
const COMP = [
  { id: "paid", label: "Paid" },
  { id: "equity", label: "Equity" },
  { id: "learning", label: "Learning" },
];

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function StudentWizard({ vault, initial }: { vault: VaultSkill[]; initial: StudentInput }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<StudentInput>(initial);
  const [skillIdx, setSkillIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const byId = useMemo(() => new Map(vault.map((s) => [s.id, s])), [vault]);
  const picked = Object.keys(form.skills).filter((id) => byId.has(id));
  const categories = useMemo(() => {
    const q = query.trim().toLowerCase();
    const groups = new Map<string, VaultSkill[]>();
    for (const s of vault) {
      if (q && !`${s.name} ${s.category}`.toLowerCase().includes(q)) continue;
      groups.set(s.category, [...(groups.get(s.category) ?? []), s]);
    }
    return [...groups];
  }, [vault, query]);

  function pickSkill(id: string) {
    const next = { ...form.skills };
    if (id in next) delete next[id];
    else if (picked.length < MAX_SKILLS) next[id] = {};
    setForm({ ...form, skills: next });
  }

  function setAnswer(skillId: string, questionId: string, value: unknown) {
    setForm({ ...form, skills: { ...form.skills, [skillId]: { ...form.skills[skillId], [questionId]: value } } });
  }

  function stepError(): string | undefined {
    if (step === 0) {
      if (form.name.trim().length < 2) return "Add your name.";
      if (!/^[a-z0-9_]{3,24}$/.test(form.handle)) return "Handle: 3–24 lowercase letters, numbers or _.";
      if (!form.discipline) return "Choose your discipline.";
      if (!form.city.trim()) return "Add your city.";
      if (!form.consent) return "Please accept the data consent to continue.";
    }
    if (step === 2 && picked.length === 0) return "Pick at least one skill.";
    if (step === 3) {
      const skill = byId.get(picked[skillIdx])!;
      const answers = form.skills[skill.id] ?? {};
      for (const q of skill.questions) {
        const a = answers[q.id] as { choice?: string } | string | undefined;
        if (q.type === "single" && !a) return `Answer: ${q.prompt}`;
        if (q.type === "single_link" && !(a as { choice?: string })?.choice) return `Answer: ${q.prompt}`;
      }
    }
  }

  function next() {
    const err = stepError();
    setError(err);
    if (err) return;
    if (step === 3 && skillIdx < picked.length - 1) return setSkillIdx(skillIdx + 1);
    if (step < 3) {
      setSkillIdx(0);
      return setStep(step + 1);
    }
    startTransition(async () => {
      const result = await saveStudentOnboarding({
        ...form,
        skills: Object.fromEntries(picked.map((id) => [id, form.skills[id]])),
      });
      if (result) setError(result.error);
    });
  }

  function back() {
    setError(undefined);
    if (step === 3 && skillIdx > 0) return setSkillIdx(skillIdx - 1);
    setStep(Math.max(0, step - 1));
  }

  const current = step === 3 ? byId.get(picked[skillIdx]) : undefined;

  return (
    <div>
      <ol className="mb-8 flex gap-2" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex-1">
            <span className={`block h-1.5 rounded-full ${i <= step ? "bg-ember" : "bg-line"}`} />
            <span className={`mt-2 block text-xs ${i === step ? "font-semibold text-ink" : "text-muted"}`}>{label}</span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section>
          <h1 className="text-2xl font-bold tracking-tight">Let&apos;s build your Skill Card</h1>
          <p className="mb-6 mt-1 text-ink-soft">About 5 minutes. No GPA, no resume upload.</p>
          <BasicsFields value={form} onChange={(v) => setForm({ ...form, ...v })} />
        </section>
      )}

      {step === 1 && (
        <section className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">When and how can you work?</h1>
          <fieldset>
            <legend className="label">Availability</legend>
            <div className="flex flex-wrap gap-2">
              {(["now", "soon", "busy"] as const).map((a) => (
                <button
                  type="button"
                  key={a}
                  aria-pressed={form.availability === a}
                  onClick={() => setForm({ ...form, availability: a })}
                  className={`chip !px-4 !py-2 !text-sm ${form.availability === a ? "!border-ember bg-ember-soft !text-ember-dark" : ""}`}
                >
                  {{ now: "Available now", soon: "In a few weeks", busy: "Just browsing" }[a]}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="hours" className="label">Hours per week: <strong className="text-ink">{form.hoursPerWeek}</strong></label>
            <input
              id="hours"
              type="range"
              min={1}
              max={40}
              className="w-full accent-ember"
              value={form.hoursPerWeek}
              onChange={(e) => setForm({ ...form, hoursPerWeek: Number(e.target.value) })}
            />
          </div>
          <fieldset>
            <legend className="label">Open to</legend>
            <div className="flex flex-wrap gap-2">
              {COMP.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  aria-pressed={form.compPref.includes(c.id)}
                  onClick={() => setForm({ ...form, compPref: toggle(form.compPref, c.id) })}
                  className={`chip !px-4 !py-2 !text-sm ${form.compPref.includes(c.id) ? "!border-ember bg-ember-soft !text-ember-dark" : ""}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="label">Fields you want to work on</legend>
            <div className="flex flex-wrap gap-2">
              {FIELDS.map((f) => (
                <button
                  type="button"
                  key={f}
                  aria-pressed={form.wantsFields.includes(f)}
                  onClick={() => setForm({ ...form, wantsFields: toggle(form.wantsFields, f) })}
                  className={`chip capitalize ${form.wantsFields.includes(f) ? "!border-ember bg-ember-soft !text-ember-dark" : ""}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="bio" className="label">Short bio <span className="font-normal text-muted">(optional)</span></label>
            <textarea id="bio" rows={3} maxLength={500} className="field" value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <h1 className="text-2xl font-bold tracking-tight">Which skills can you put to work?</h1>
          <p className="mb-4 mt-1 text-ink-soft">
            Pick up to {MAX_SKILLS}. Any discipline counts. <span className="font-medium text-ink">{picked.length} picked.</span>
          </p>
          <input
            type="search"
            placeholder="Search skills: video, legal, Excel…"
            className="field mb-6"
            aria-label="Search skills"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="space-y-6">
            {categories.map(([cat, skills]) => (
              <fieldset key={cat}>
                <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{cat}</legend>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => {
                    const on = s.id in form.skills;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        aria-pressed={on}
                        disabled={!on && picked.length >= MAX_SKILLS}
                        onClick={() => pickSkill(s.id)}
                        className={`chip !px-4 !py-2 !text-sm disabled:opacity-40 ${on ? "!border-ember bg-ember text-white" : "hover:border-ink-soft"}`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
            {categories.length === 0 && <p className="text-sm text-muted">No skills match &ldquo;{query}&rdquo;.</p>}
          </div>
        </section>
      )}

      {step === 3 && current && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Skill {skillIdx + 1} of {picked.length} · {current.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{current.name}</h1>
          <p className="mb-6 mt-2 rounded-xl bg-ember-soft px-4 py-3 text-sm text-ember-dark">
            <strong>1-hour test:</strong> {current.one_hour_test}.
          </p>
          <div className="space-y-6">
            {current.questions.map((q, i) => (
              <SkillQuestionInput
                key={q.id}
                index={i + 1}
                question={q}
                value={form.skills[current.id]?.[q.id]}
                onChange={(v) => setAnswer(current.id, q.id, v)}
              />
            ))}
          </div>
        </section>
      )}

      {error && <p role="alert" className="mt-6 rounded-xl bg-ember-soft px-4 py-3 text-sm text-ember-dark">{error}</p>}

      <div className="mt-8 flex justify-between gap-3">
        <button type="button" onClick={back} className="btn-ghost" disabled={step === 0 || pending}>Back</button>
        <button type="button" onClick={next} className="btn-primary" disabled={pending}>
          {pending ? "Saving…" : step === 3 && skillIdx === picked.length - 1 ? "Create my Skill Card" : "Continue"}
        </button>
      </div>
    </div>
  );
}
