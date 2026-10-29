"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/session";
import { loadVault, validateAnswers } from "@/lib/vault";
import { FIELDS } from "@/lib/types";

export type ActionResult = { error: string } | undefined;

export type BasicsInput = {
  name: string;
  handle: string;
  headline?: string;
  discipline: string;
  year?: string;
  city: string;
  consent: boolean;
};

export type StudentInput = BasicsInput & {
  availability: "now" | "soon" | "busy";
  hoursPerWeek: number;
  compPref: string[];
  wantsFields: string[];
  bio?: string;
  skills: Record<string, Record<string, unknown>>; // skill_id -> question_id -> answer
};

export type FounderInput = BasicsInput & {
  idea: {
    title: string;
    summary: string;
    field: string;
    stage: "idea" | "prototype" | "launched";
    compType: "paid" | "equity" | "learning";
    skills: Record<string, "must" | "nice">;
  };
};

const MAX_SKILLS = 8;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

async function saveBasics(input: BasicsInput, role: "student" | "founder"): Promise<ActionResult> {
  const viewer = await getViewer();
  if (!viewer) return { error: "Your session expired. Sign in again." };
  if (!input.consent) return { error: "Please accept the data consent to continue." };

  const name = str(input.name, 80);
  const handle = str(input.handle, 24).toLowerCase();
  if (name.length < 2) return { error: "Add your name." };
  if (!/^[a-z0-9_]{3,24}$/.test(handle)) return { error: "Handle: 3–24 lowercase letters, numbers or _." };

  const supabase = await createClient();
  const { error: userErr } = await supabase
    .from("users")
    .update({
      name,
      handle,
      headline: str(input.headline, 120) || null,
      consent_at: viewer.consented ? undefined : new Date().toISOString(),
    })
    .eq("id", viewer.id);
  if (userErr) {
    return { error: userErr.code === "23505" ? "That handle is taken. Try another." : "Couldn't save your details." };
  }

  const { error: profErr } = await supabase
    .from("profiles")
    .update({ discipline: str(input.discipline, 60), year: str(input.year, 20) || null, city: str(input.city, 60) })
    .eq("user_id", viewer.id);
  if (profErr) return { error: "Couldn't save your profile." };

  if (!viewer.roles.includes(role)) {
    const { error } = await supabase.from("roles").insert({ user_id: viewer.id, role });
    if (error) return { error: "Couldn't set your role." };
  }
}

export async function saveStudentOnboarding(input: StudentInput): Promise<ActionResult> {
  const basics = await saveBasics(input, "student");
  if (basics) return basics;

  const skillIds = Object.keys(input.skills ?? {});
  if (skillIds.length === 0) return { error: "Pick at least one skill." };
  if (skillIds.length > MAX_SKILLS) return { error: `Pick up to ${MAX_SKILLS} skills.` };

  const supabase = await createClient();
  const viewer = (await getViewer())!;

  const hours = Math.max(0, Math.min(60, Math.round(Number(input.hoursPerWeek) || 0)));
  const { error: profErr } = await supabase
    .from("profiles")
    .update({
      availability: ["now", "soon", "busy"].includes(input.availability) ? input.availability : "now",
      hours_per_week: hours,
      comp_pref: (input.compPref ?? []).filter((c) => ["paid", "equity", "learning"].includes(c)),
      wants_fields: (input.wantsFields ?? []).filter((f) => (FIELDS as readonly string[]).includes(f)),
      bio: str(input.bio, 500) || null,
    })
    .eq("user_id", viewer.id);
  if (profErr) return { error: "Couldn't save your availability." };

  const vault = new Map((await loadVault(supabase)).map((s) => [s.id, s]));
  const { data: existing } = await supabase.from("card_skills").select("id, skill_id, answers_json").eq("user_id", viewer.id);
  const existingBySkill = new Map((existing ?? []).map((c) => [c.skill_id as string, c]));

  for (const skillId of skillIds) {
    const skill = vault.get(skillId);
    if (!skill) return { error: "One of those skills no longer exists. Refresh and try again." };
    const result = validateAnswers(skill, input.skills[skillId] ?? {});
    if (!result.ok) return { error: result.error };

    const prev = existingBySkill.get(skillId);
    // Unchanged answers keep their tier; changed answers drop back to T0 for re-verification.
    if (prev && JSON.stringify(prev.answers_json) === JSON.stringify(result.answers)) continue;

    const { data: row, error } = await supabase
      .from("card_skills")
      .upsert(
        { user_id: viewer.id, skill_id: skillId, answers_json: result.answers, tier: "T0", verified_at: null, expires_at: null },
        { onConflict: "user_id,skill_id" },
      )
      .select("id")
      .single();
    if (error || !row) return { error: `Couldn't save ${skill.name}.` };

    if (result.links.length) {
      await supabase.from("evidence").insert(result.links.map((url) => ({ card_skill_id: row.id, url, source: "student" })));
    }
  }

  const removed = [...existingBySkill.keys()].filter((id) => !skillIds.includes(id));
  if (removed.length) await supabase.from("card_skills").delete().eq("user_id", viewer.id).in("skill_id", removed);

  revalidatePath(`/card/${str(input.handle, 24).toLowerCase()}`);
  redirect(`/card/${str(input.handle, 24).toLowerCase()}?new=1`);
}

export async function saveFounderOnboarding(input: FounderInput): Promise<ActionResult> {
  const { idea } = input;
  const title = str(idea?.title, 90);
  const summary = str(idea?.summary, 1200);
  if (title.length < 4) return { error: "Give your idea a title (4+ characters)." };
  if (summary.length < 20) return { error: "Describe the idea in at least 20 characters." };
  if (!(FIELDS as readonly string[]).includes(idea.field)) return { error: "Pick a field." };
  if (!["idea", "prototype", "launched"].includes(idea.stage)) return { error: "Pick a stage." };
  if (!["paid", "equity", "learning"].includes(idea.compType)) return { error: "Pick what you offer." };

  const tagged = Object.entries(idea.skills ?? {}).filter(([, p]) => p === "must" || p === "nice");
  if (!tagged.some(([, p]) => p === "must")) return { error: "Mark at least one skill as a must-have." };
  if (tagged.length > 10) return { error: "Tag up to 10 skills." };

  const basics = await saveBasics(input, "founder");
  if (basics) return basics;

  const supabase = await createClient();
  const viewer = (await getViewer())!;
  const { data: row, error } = await supabase
    .from("ideas")
    .insert({ founder_id: viewer.id, title, summary, field: idea.field, stage: idea.stage, comp_type: idea.compType })
    .select("id")
    .single();
  if (error || !row) return { error: "Couldn't post your idea." };

  const { error: tagErr } = await supabase
    .from("idea_skills")
    .insert(tagged.map(([skill_id, priority]) => ({ idea_id: row.id, skill_id, priority })));
  if (tagErr) return { error: "Idea posted, but the skill tags didn't save. Edit it from your dashboard." };

  revalidatePath("/ideas");
  redirect(`/ideas/${row.id}?new=1`);
}
