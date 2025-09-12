import { supabase } from '@/lib/supabase';
import type { UserPlan, ActivationCode } from '@/lib/supabase';

export interface PlanLimits {
  backgroundRemovals: number;
  batchProcessing: boolean;
  hdDownloads: boolean;
  manualEditing: boolean;
  backgroundEffects: boolean;
}

const FREE_PLAN_LIMITS: PlanLimits = {
  backgroundRemovals: 3,
  batchProcessing: false,
  hdDownloads: false,
  manualEditing: false,
  backgroundEffects: false,
};

const PREMIUM_PLAN_LIMITS: PlanLimits = {
  backgroundRemovals: -1, // unlimited
  batchProcessing: true,
  hdDownloads: true,
  manualEditing: true,
  backgroundEffects: true,
};

export const getPlanLimits = (planType: 'free' | 'premium'): PlanLimits => {
  return planType === 'premium' ? PREMIUM_PLAN_LIMITS : FREE_PLAN_LIMITS;
};

export const getUserPlan = async (): Promise<UserPlan | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data: userPlan, error } = await supabase
      .from('user_plans')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user plan:', error);
      return null;
    }

    // Check if premium plan has expired
    if (userPlan.plan_type === 'premium' && userPlan.expiry_date) {
      const expiry = new Date(userPlan.expiry_date);
      if (expiry < new Date()) {
        // Plan expired, reset to free
        await resetToFreePlan(user.id);
        return await getUserPlan(); // Recursively get updated plan
      }
    }

    return userPlan;
  } catch (error) {
    console.error('Error in getUserPlan:', error);
    return null;
  }
};

export const resetToFreePlan = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_plans')
      .update({
        plan_type: 'free',
        background_removals_used: 0,
        background_removals_limit: 3,
        expiry_date: null,
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error resetting to free plan:', error);
    }
  } catch (error) {
    console.error('Error in resetToFreePlan:', error);
  }
};

export const incrementBackgroundRemovalUsage = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const userPlan = await getUserPlan();
    if (!userPlan) {
      return false;
    }

    if (userPlan.plan_type === 'premium') {
      return true; // Unlimited for premium
    }

    if (userPlan.background_removals_used >= userPlan.background_removals_limit) {
      return false; // Limit reached
    }

    const { error } = await supabase
      .from('user_plans')
      .update({
        background_removals_used: userPlan.background_removals_used + 1,
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in incrementBackgroundRemovalUsage:', error);
    return false;
  }
};

export const canUseBackgroundRemoval = async (): Promise<boolean> => {
  try {
    const userPlan = await getUserPlan();
    
    if (!userPlan) {
      return false;
    }

    if (userPlan.plan_type === 'premium') {
      return true;
    }

    return userPlan.background_removals_used < userPlan.background_removals_limit;
  } catch (error) {
    console.error('Error in canUseBackgroundRemoval:', error);
    return false;
  }
};

export const getRemainingBackgroundRemovals = async (): Promise<number> => {
  try {
    const userPlan = await getUserPlan();
    
    if (!userPlan) {
      return 0;
    }

    if (userPlan.plan_type === 'premium') {
      return -1; // Unlimited
    }

    return Math.max(0, userPlan.background_removals_limit - userPlan.background_removals_used);
  } catch (error) {
    console.error('Error in getRemainingBackgroundRemovals:', error);
    return 0;
  }
};

export const activateWithCode = async (code: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const upperCode = code.toUpperCase().trim();

    // Start a transaction to check and use the activation code
    const { data: activationCode, error: fetchError } = await supabase
      .from('activation_codes')
      .select('*')
      .eq('code', upperCode)
      .eq('is_used', false)
      .single();

    if (fetchError || !activationCode) {
      return false; // Code not found or already used
    }

    // Mark code as used
    const { error: updateCodeError } = await supabase
      .from('activation_codes')
      .update({
        is_used: true,
        used_by: user.id,
        used_at: new Date().toISOString(),
      })
      .eq('id', activationCode.id);

    if (updateCodeError) {
      console.error('Error updating activation code:', updateCodeError);
      return false;
    }

    // Upgrade user to premium
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month from now

    const { error: updatePlanError } = await supabase
      .from('user_plans')
      .update({
        plan_type: 'premium',
        background_removals_used: 0,
        background_removals_limit: -1,
        expiry_date: expiryDate.toISOString(),
      })
      .eq('user_id', user.id);

    if (updatePlanError) {
      console.error('Error updating user plan:', updatePlanError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in activateWithCode:', error);
    return false;
  }
};

export const upgradeToPremium = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month from now

    const { error } = await supabase
      .from('user_plans')
      .update({
        plan_type: 'premium',
        background_removals_used: 0,
        background_removals_limit: -1,
        expiry_date: expiryDate.toISOString(),
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error upgrading to premium:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in upgradeToPremium:', error);
    return false;
  }
};

// Authentication helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};