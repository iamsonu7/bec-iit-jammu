import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** Cookie-less anon client for public reads (Skill Cards, share images). */
export function createPublicClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
}
