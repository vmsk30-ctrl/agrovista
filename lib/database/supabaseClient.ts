import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));

let clientInstance: SupabaseClient | null = null;
let adminClientInstance: SupabaseClient | null = null;

// Public client (for browser and client components)
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
      },
    });
  }
  return clientInstance;
}

// Server Admin client (bypasses RLS for secure backend services)
export function getAdminSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseUrl.startsWith('https://')) {
    return null;
  }
  if (!adminClientInstance) {
    adminClientInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return adminClientInstance;
}
