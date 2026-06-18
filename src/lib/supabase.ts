import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mofnnanomdejvcjiskef.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZm5uYW5vbWRlanZjamlza2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MjUzMTksImV4cCI6MjA5NzMwMTMxOX0.oFp3No4vT3nQ42sMjW2iz3znTaS9oGszZFSk--Mn6YA';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type UserRole = 'admin' | 'guru' | 'siswa';

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
}
