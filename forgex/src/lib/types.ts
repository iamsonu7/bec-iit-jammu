export type Role = "student" | "founder" | "institute_admin" | "bec_admin";
export type Tier = "T0" | "T1" | "T2";
export type QuestionType = "multi" | "single" | "link" | "single_link";

export type Skill = { id: string; name: string; category: string; one_hour_test: string };

export type SkillQuestion = {
  id: string;
  skill_id: string;
  prompt: string;
  type: QuestionType;
  options_json: string[];
  order: number;
};

/** multi → string[]; single → string; link → url; single_link → { choice, link } */
export type Answer = string | string[] | { choice: string; link?: string };
export type Answers = Record<string, Answer>;

export type CardSkill = {
  id: string;
  skill_id: string;
  tier: Tier;
  answers_json: Answers;
  skills: Skill;
  evidence: { url: string }[];
};

export type PublicCard = {
  user_id: string;
  handle: string;
  name: string | null;
  headline: string | null;
  availability: "now" | "soon" | "busy" | null;
  hours_per_week: number | null;
  comp_pref: string[];
  wants_fields: string[];
  bio: string | null;
};

export type Idea = {
  id: string;
  founder_id: string;
  title: string;
  summary: string;
  field: string;
  stage: "idea" | "prototype" | "launched";
  comp_type: "paid" | "equity" | "learning";
  status: string;
  created_at: string;
  idea_skills: { skill_id: string; priority: "must" | "nice"; skills: Pick<Skill, "name"> }[];
};

export const TIER_LABEL: Record<Tier, string> = {
  T0: "Claimed",
  T1: "Evidence found",
  T2: "Verified",
};

export const FIELDS = [
  "edtech", "health", "fintech", "agritech", "climate", "fashion", "media", "social impact",
  "consumer", "deeptech", "legaltech", "mobility", "food", "gaming", "other",
] as const;

export const DISCIPLINES = [
  "Engineering", "Design", "Commerce", "Management", "Law", "Medicine & Health",
  "Science", "Arts & Humanities", "Media", "Other",
] as const;
