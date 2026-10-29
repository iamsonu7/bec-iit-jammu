"use client";

import type { SkillQuestion } from "@/lib/types";

const optionClass = (on: boolean) =>
  `chip !px-4 !py-2 !text-sm ${on ? "!border-ember bg-ember-soft !text-ember-dark" : "hover:border-ink-soft"}`;

export function SkillQuestionInput({
  index,
  question: q,
  value,
  onChange,
}: {
  index: number;
  question: SkillQuestion;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const id = `q-${q.id}`;
  const hint = { multi: "Select all that apply", single: "", link: "Optional, but it moves you towards “Evidence found”", single_link: "" }[q.type];

  return (
    <fieldset>
      <legend className="font-medium">
        <span className="mr-2 text-muted">Q{index}.</span>
        {q.prompt}
      </legend>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      <div className="mt-3">
        {q.type === "multi" && (
          <div className="flex flex-wrap gap-2">
            {q.options_json.map((o) => {
              const list = Array.isArray(value) ? (value as string[]) : [];
              const on = list.includes(o);
              return (
                <button type="button" key={o} aria-pressed={on} className={optionClass(on)} onClick={() => onChange(on ? list.filter((x) => x !== o) : [...list, o])}>
                  {o}
                </button>
              );
            })}
          </div>
        )}

        {q.type === "single" && (
          <div className="flex flex-wrap gap-2" role="radiogroup">
            {q.options_json.map((o) => (
              <button type="button" role="radio" aria-checked={value === o} key={o} className={optionClass(value === o)} onClick={() => onChange(o)}>
                {o}
              </button>
            ))}
          </div>
        )}

        {q.type === "link" && (
          <input id={id} type="url" inputMode="url" placeholder="https://" className="field" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />
        )}

        {q.type === "single_link" && (() => {
          const v = (value ?? {}) as { choice?: string; link?: string };
          return (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2" role="radiogroup">
                {q.options_json.map((o) => (
                  <button type="button" role="radio" aria-checked={v.choice === o} key={o} className={optionClass(v.choice === o)} onClick={() => onChange({ ...v, choice: o })}>
                    {o}
                  </button>
                ))}
              </div>
              {v.choice === "Yes" && (
                <input
                  type="url"
                  inputMode="url"
                  aria-label="Link to that work (optional)"
                  placeholder="Link to it (optional) https://"
                  className="field"
                  value={v.link ?? ""}
                  onChange={(e) => onChange({ ...v, link: e.target.value })}
                />
              )}
            </div>
          );
        })()}
      </div>
    </fieldset>
  );
}
