import React from 'react';
import { Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserPlan, getRemainingBackgroundRemovals } from '@/utils/planManager';

interface PlanStatusProps {
  onUpgradeClick?: () => void;
}

const PlanStatus: React.FC<PlanStatusProps> = ({ onUpgradeClick }) => {
  const plan = getUserPlan();
  const remaining = getRemainingBackgroundRemovals();

  // Don't show anything for free plan users
  if (plan.type === 'free') {
    return null;
  }

  if (plan.type === 'premium') {
    return (
      <div className="fixed top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 rounded-lg shadow-lg z-50">
        <div className="flex items-center gap-2 mb-1">
          <Crown className="w-5 h-5" />
          <span className="font-semibold">Premium Active</span>
        </div>
        <div className="text-sm opacity-90">
          Unlimited background removals
        </div>
      </div>
    );
  }
  
  return null;
};

export default PlanStatus;