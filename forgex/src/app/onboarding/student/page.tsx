import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireViewer } from "@/lib/session";
import { loadVault } from "@/lib/vault";
import { StudentWizard } from "./wizard";

export const metadata: Metadata = { title: "Build your Skill Card" };

export default async function StudentOnboarding() {
  const viewer = await requireViewer("/onboarding/student");
  const supabase = await createClient();
  const [vault, { data: profile }, { data: cardSkills }] = await Promise.all([
    loadVault(supabase),
    supabase.from("profiles").select("*").eq("user_id", viewer.id).single(),
    supabase.from("card_skills").select("skill_id, answers_json").eq("user_id", viewer.id),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <StudentWizard
        vault={vault}
        initial={{
          name: viewer.name ?? "",
          handle: viewer.handle ?? viewer.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24),
          headline: viewer.headline ?? "",
          discipline: profile?.discipline ?? "",
          year: profile?.year ?? "",
          city: profile?.city ?? "",
          consent: viewer.consented,
          availability: profile?.availability ?? "now",
          hoursPerWeek: profile?.hours_per_week ?? 6,
          compPref: profile?.comp_pref ?? [],
          wantsFields: profile?.wants_fields ?? [],
          bio: profile?.bio ?? "",
          skills: Object.fromEntries((cardSkills ?? []).map((c) => [c.skill_id, c.answers_json])),
        }}
      />
    </div>
  );
}
