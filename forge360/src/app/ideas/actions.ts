"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/session";

export type InterestState = { error?: string; ok?: boolean } | undefined;

export async function expressInterest(_: InterestState, form: FormData): Promise<InterestState> {
  const viewer = await getViewer();
  if (!viewer) return { error: "Sign in first." };
  if (!viewer.roles.includes("student")) return { error: "Build your Skill Card first, so the founder can see what you can do." };

  const ideaId = String(form.get("idea_id") ?? "");
  const message = String(form.get("message") ?? "").trim();
  if (message.length < 10) return { error: "Write at least a line about how you'd help (10+ characters)." };
  if (message.length > 500) return { error: "Keep it under 500 characters." };

  const supabase = await createClient();
  const { error } = await supabase.from("interests").insert({ idea_id: ideaId, student_id: viewer.id, message });
  if (error) {
    return { error: error.code === "23505" ? "You've already expressed interest in this idea." : "Couldn't send. The idea may be closed." };
  }
  revalidatePath(`/ideas/${ideaId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}
