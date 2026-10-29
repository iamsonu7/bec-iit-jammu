import { createPublicClient } from "./supabase/public";
import { isSupabaseConfigured } from "./supabase/env";
import type { Answers, CardSkill, PublicCard, Tier } from "./types";

export type CardData = { card: PublicCard; skills: CardSkill[] };

const TIER_RANK: Record<Tier, number> = { T2: 0, T1: 1, T0: 2 };

export async function loadCard(handle: string): Promise<CardData | null> {
  if (!isSupabaseConfigured || !/^[a-z0-9_]{3,24}$/.test(handle)) return null;
  const supabase = createPublicClient();
  const { data: card } = await supabase.from("public_cards").select("*").eq("handle", handle).maybeSingle();
  if (!card) return null;
  const { data: skills } = await supabase
    .from("card_skills")
    .select("id, skill_id, tier, answers_json, skills(id, name, category, one_hour_test), evidence(url)")
    .eq("user_id", card.user_id);
  const sorted = ((skills ?? []) as unknown as CardSkill[]).sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier]);
  return { card: card as PublicCard, skills: sorted };
}

/** Pulls the readable bits out of a skill's answers by shape (see QuestionType). */
export function summariseAnswers(answers: Answers) {
  let tools: string[] = [];
  let oneHour: string | undefined;
  let delivered: string | undefined;
  for (const a of Object.values(answers)) {
    if (Array.isArray(a)) tools = a;
    else if (typeof a === "string" && !a.startsWith("http")) oneHour = a;
    else if (a && typeof a === "object") delivered = a.choice;
  }
  return { tools, oneHour, delivered };
}

export function evidenceLinks(skill: CardSkill): string[] {
  const fromAnswers = Object.values(skill.answers_json).flatMap((a) =>
    typeof a === "string" && a.startsWith("http") ? [a] : a && typeof a === "object" && !Array.isArray(a) && a.link ? [a.link] : [],
  );
  return [...new Set([...skill.evidence.map((e) => e.url), ...fromAnswers])];
}
