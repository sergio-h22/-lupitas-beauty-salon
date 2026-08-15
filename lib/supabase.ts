import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Lazily constructed.
 *
 * Throwing at module scope when the env vars are absent takes down every route
 * that imports this file — including during `next build` — so a repo without
 * Supabase configured could not be built or previewed at all. Instead the
 * client is created on first use and callers get a clear, catchable error.
 */
let client: SupabaseClient | null = null;

export function isAuthConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.',
    );
  }

  client = createClient(url, anonKey);
  return client;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getSession() {
  const { data, error } = await getSupabase().auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

export async function getCurrentUser() {
  const { data, error } = await getSupabase().auth.getUser();
  if (error) throw new Error(error.message);
  return data.user;
}
