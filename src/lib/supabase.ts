import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have real Supabase configuration
const isRealSupabaseConfig = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.includes('supabase.co') && 
  !supabaseAnonKey.includes('PLACEHOLDER') &&
  supabaseAnonKey.length > 50;

if (!isRealSupabaseConfig) {
  console.warn('No valid Supabase configuration found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create Supabase client - use real config if available, otherwise use your project
export const supabase = createClient(
  supabaseUrl || 'https://wenqtilejbvbiglxkmko.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlbnF0aWxlamJ2YmlnbHhrbWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3MzQ0MDAsImV4cCI6MjA1MjMxMDQwMH0.PLACEHOLDER_ANON_KEY',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

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