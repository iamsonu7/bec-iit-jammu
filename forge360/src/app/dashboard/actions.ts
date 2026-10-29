"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/session";

const UUID = /^[0-9a-f-]{36}$/;

export async function respondToInterest(form: FormData) {
  const id = String(form.get("interest_id"));
  const accept = form.get("decision") === "accept";
  if (!UUID.test(id)) return;
  const supabase = await createClient();
  await supabase.rpc("respond_to_interest", { p_interest: id, p_accept: accept });
  revalidatePath("/dashboard");
}

export async function withdrawInterest(form: FormData) {
  const id = String(form.get("interest_id"));
  if (!UUID.test(id)) return;
  const supabase = await createClient();
  await supabase.rpc("withdraw_interest", { p_interest: id });
  revalidatePath("/dashboard");
}

export async function setIdeaStatus(form: FormData) {
  const id = String(form.get("idea_id"));
  const status = String(form.get("status"));
  if (!UUID.test(id) || !["open", "paused", "closed"].includes(status)) return;
  const viewer = await getViewer();
  if (!viewer) return;
  const supabase = await createClient();
  await supabase.from("ideas").update({ status }).eq("id", id).eq("founder_id", viewer.id);
  revalidatePath("/dashboard");
  revalidatePath("/ideas");
}

export async function deleteMyAccount(form: FormData) {
  if (form.get("confirm") !== "DELETE") return;
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_my_account");
  if (!error) await supabase.auth.signOut();
  redirect("/");
}
