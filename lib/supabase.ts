import { createClient } from "@supabase/supabase-js";

let supabaseClient: any = null;

export function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    
    if (!url || !anonKey) {
      console.warn("Supabase URL or Anon key is missing. Falling back to local/mock mode.");
      return null;
    }
    
    try {
      supabaseClient = createClient(url, anonKey);
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
      return null;
    }
  }
  return supabaseClient;
}
