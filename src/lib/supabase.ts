import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mofnnanomdejvcjiskef.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZm5uYW5vbWRlanZjamlza2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MjUzMTksImV4cCI6MjA5NzMwMTMxOX0.oFp3No4vT3nQ42sMjW2iz3znTaS9oGszZFSk--Mn6YA';

export let supabase: SupabaseClient;

try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.error("Failed to initialize Supabase client. Check VITE_SUPABASE_URL:", error);
  // Provide a dummy client to prevent module import crash, though DB features will fail
  supabase = createClient('https://placeholder.supabase.co', 'placeholder');
}

export type UserRole = 'admin' | 'guru' | 'siswa';

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
}
