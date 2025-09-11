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

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 p-3 rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-blue-500" />
        <span className="font-semibold">Free Plan</span>
      </div>
      <div className="text-sm text-gray-600 mb-2">
        {remaining > 0 ? (
          <>Background removals: <strong>{remaining}/3 left</strong></>
        ) : (
          <span className="text-red-600"><strong>0/3 left - Limit reached!</strong></span>
        )}
      </div>
      {remaining <= 1 && (
        <Button
          onClick={onUpgradeClick}
          size="sm"
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
        >
          <Crown className="w-4 h-4 mr-1" />
          Upgrade to Premium
        </Button>
      )}
    </div>
  );
};

export default PlanStatus;