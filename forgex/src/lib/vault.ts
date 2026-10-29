import type { SupabaseClient } from "@supabase/supabase-js";
import type { Answer, Answers, Skill, SkillQuestion } from "./types";

export type VaultSkill = Skill & { questions: SkillQuestion[] };

export async function loadVault(supabase: SupabaseClient): Promise<VaultSkill[]> {
  const [{ data: skills }, { data: questions }] = await Promise.all([
    supabase.from("skills").select("id, name, category, one_hour_test").eq("active", true).order("category").order("name"),
    supabase.from("skill_questions").select("id, skill_id, prompt, type, options_json, order").order("order"),
  ]);
  const bySkill = new Map<string, SkillQuestion[]>();
  for (const q of (questions ?? []) as SkillQuestion[]) {
    bySkill.set(q.skill_id, [...(bySkill.get(q.skill_id) ?? []), q]);
  }
  return ((skills ?? []) as Skill[]).map((s) => ({ ...s, questions: bySkill.get(s.id) ?? [] }));
}

export function isUrl(v: unknown): v is string {
  if (typeof v !== "string" || v.length > 500) return false;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Server-side check of one skill's answers against its questions.
 * Returns cleaned answers plus any proof links, or an error message.
 */
export function validateAnswers(
  skill: VaultSkill,
  raw: Record<string, unknown>,
): { ok: true; answers: Answers; links: string[] } | { ok: false; error: string } {
  const answers: Answers = {};
  const links: string[] = [];
  for (const q of skill.questions) {
    const v = raw[q.id];
    let a: Answer | undefined;
    switch (q.type) {
      case "multi": {
        const picked = Array.isArray(v) ? v.filter((x): x is string => q.options_json.includes(x as string)) : [];
        a = [...new Set(picked)];
        break;
      }
      case "single":
        if (typeof v !== "string" || !q.options_json.includes(v)) return { ok: false, error: `${skill.name}: answer “${q.prompt}”` };
        a = v;
        break;
      case "link":
        if (v === undefined || v === "") break;
        if (!isUrl(v)) return { ok: false, error: `${skill.name}: that link doesn't look right` };
        a = v;
        links.push(v);
        break;
      case "single_link": {
        const o = (v ?? {}) as { choice?: unknown; link?: unknown };
        if (typeof o.choice !== "string" || !q.options_json.includes(o.choice)) {
          return { ok: false, error: `${skill.name}: answer “${q.prompt}”` };
        }
        if (o.link && !isUrl(o.link)) return { ok: false, error: `${skill.name}: that link doesn't look right` };
        a = { choice: o.choice, ...(o.link ? { link: o.link as string } : {}) };
        if (o.link) links.push(o.link as string);
        break;
      }
    }
    if (a !== undefined) answers[q.id] = a;
  }
  return { ok: true, answers, links };
}
