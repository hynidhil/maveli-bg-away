import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase first.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserPlan {
  id: string;
  user_id: string;
  plan_type: 'free' | 'premium';
  background_removals_used: number;
  background_removals_limit: number;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivationCode {
  id: string;
  code: string;
  is_used: boolean;
  used_by?: string;
  used_at?: string;
  created_at: string;
}