import { createClient } from "@supabase/supabase-js";
import { env, requireEnvVars } from "../config/env.js";

let supabaseClient = null;

export function getSupabase() {
  if (!supabaseClient) {
    requireEnvVars(["SUPABASE_URL", "SUPABASE_KEY"]);
    supabaseClient = createClient(env.supabaseUrl, env.supabaseKey);
  }

  return supabaseClient;
}
