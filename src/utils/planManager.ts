// Plan management utility

// Premium activation codes
const ACTIVATION_CODES = [
  'PLM8Q2', 'KJT3B9', 'ZRX1M4', 'QWF7N6', 'HPL2V8',
  'BND5K1', 'YTR9S3', 'MNC4D7', 'SLP6G0', 'VBG2H5',
  'XQZ8L1', 'RFT0P6', 'GHY3T2', 'LOP5Z9', 'CZM7R4',
  'NBA1K8', 'TUV6W3', 'JKL9X0', 'FGH2Y5', 'QAZ4S7'
];

export interface PlanLimits {
  backgroundRemovals: number;
  batchProcessing: boolean;
  hdDownloads: boolean;
  manualEditing: boolean;
  backgroundEffects: boolean;
}

export interface UserPlan {
  type: 'free' | 'premium';
  backgroundRemovalsUsed: number;
  backgroundRemovalsLimit: number;
  expiryDate?: string;
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

export const getUserPlan = (): UserPlan => {
  const stored = localStorage.getItem('userPlan');
  if (stored) {
    try {
      const plan = JSON.parse(stored);
      // Check if premium plan has expired
      if (plan.type === 'premium' && plan.expiryDate) {
        const expiry = new Date(plan.expiryDate);
        if (expiry < new Date()) {
          // Plan expired, reset to free
          const freePlan: UserPlan = {
            type: 'free',
            backgroundRemovalsUsed: 0,
            backgroundRemovalsLimit: 3,
          };
          localStorage.setItem('userPlan', JSON.stringify(freePlan));
          return freePlan;
        }
      }
      return plan;
    } catch (e) {
      console.error('Error parsing user plan:', e);
    }
  }
  
  // Default free plan
  const defaultPlan: UserPlan = {
    type: 'free',
    backgroundRemovalsUsed: 0,
    backgroundRemovalsLimit: 3,
  };
  localStorage.setItem('userPlan', JSON.stringify(defaultPlan));
  return defaultPlan;
};

export const updateUserPlan = (plan: UserPlan): void => {
  localStorage.setItem('userPlan', JSON.stringify(plan));
};

export const incrementBackgroundRemovalUsage = (): boolean => {
  const plan = getUserPlan();
  
  if (plan.type === 'premium') {
    return true; // Unlimited for premium
  }
  
  if (plan.backgroundRemovalsUsed >= plan.backgroundRemovalsLimit) {
    return false; // Limit reached
  }
  
  plan.backgroundRemovalsUsed += 1;
  updateUserPlan(plan);
  return true;
};

export const canUseBackgroundRemoval = (): boolean => {
  const plan = getUserPlan();
  
  if (plan.type === 'premium') {
    return true;
  }
  
  return plan.backgroundRemovalsUsed < plan.backgroundRemovalsLimit;
};

export const getRemainingBackgroundRemovals = (): number => {
  const plan = getUserPlan();
  
  if (plan.type === 'premium') {
    return -1; // Unlimited
  }
  
  return Math.max(0, plan.backgroundRemovalsLimit - plan.backgroundRemovalsUsed);
};

export const upgradeToPremium = (): void => {
  const premiumPlan: UserPlan = {
    type: 'premium',
    backgroundRemovalsUsed: 0,
    backgroundRemovalsLimit: -1,
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 2 months
  };
  updateUserPlan(premiumPlan);
};

export const resetPlan = (): void => {
  localStorage.removeItem('userPlan');
};

export const activateWithCode = (code: string): boolean => {
  const upperCode = code.toUpperCase().trim();
  
  // Check if code is valid
  if (!ACTIVATION_CODES.includes(upperCode)) {
    return false;
  }
  
  // Check if code is already used
  const usedCodes = JSON.parse(localStorage.getItem('usedActivationCodes') || '[]');
  if (usedCodes.includes(upperCode)) {
    return false;
  }
  
  // Mark code as used
  usedCodes.push(upperCode);
  localStorage.setItem('usedActivationCodes', JSON.stringify(usedCodes));
  
  // Activate premium
  const premiumPlan: UserPlan = {
    type: 'premium',
    backgroundRemovalsUsed: 0,
    backgroundRemovalsLimit: -1,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month
  };
  updateUserPlan(premiumPlan);
  
  return true;
};

export const isCodeUsed = (code: string): boolean => {
  const usedCodes = JSON.parse(localStorage.getItem('usedActivationCodes') || '[]');
  return usedCodes.includes(code.toUpperCase().trim());
};

export const getUsedCodesCount = (): number => {
  const usedCodes = JSON.parse(localStorage.getItem('usedActivationCodes') || '[]');
  return usedCodes.length;
};