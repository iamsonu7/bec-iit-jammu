import type { SupabaseClient } from "@supabase/supabase-js";
import type { Idea } from "./types";

export const IDEA_SELECT =
  "id, founder_id, title, summary, field, stage, comp_type, status, created_at, idea_skills(skill_id, priority, skills(name))";

export async function mySkillIds(supabase: SupabaseClient, userId: string): Promise<Set<string>> {
  const { data } = await supabase.from("card_skills").select("skill_id").eq("user_id", userId);
  return new Set((data ?? []).map((r) => r.skill_id as string));
}

/** L4 v1 preview: must-have skills count double. Transparent, so users see why. */
export function matchScore(idea: Idea, mine: Set<string>) {
  let have = 0;
  let score = 0;
  let max = 0;
  for (const s of idea.idea_skills) {
    const w = s.priority === "must" ? 2 : 1;
    max += w;
    if (mine.has(s.skill_id)) {
      have += 1;
      score += w;
    }
  }
  return { have, pct: max ? Math.round((score / max) * 100) : 0 };
}

export const STAGE_LABEL = { idea: "Just an idea", prototype: "Prototype", launched: "Launched" } as const;
export const COMP_LABEL = { paid: "Paid", equity: "Equity", learning: "Learning" } as const;
