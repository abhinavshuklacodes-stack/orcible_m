import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If the env vars aren't set yet, `supabase` stays null and the rest of the
// app falls back to its original local-only demo behaviour instead of
// crashing. Once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set (locally
// in .env, and in Vercel's project settings), real accounts and a real
// database take over automatically — no other code changes needed.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const isSupabaseConfigured = Boolean(supabase);

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.warn('[Orcible] Supabase is not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing). Running in local demo mode — accounts and projects are not saved to a real backend.');
}
