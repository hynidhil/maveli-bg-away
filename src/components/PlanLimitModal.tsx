import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, X, Sparkles, Zap } from 'lucide-react';
import { upgradeToPremium } from '@/utils/planManager';

interface PlanLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

const PlanLimitModal: React.FC<PlanLimitModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const handleUpgrade = () => {
    upgradeToPremium();
    onUpgrade?.();
    onClose();
    window.location.reload(); // Refresh to update plan status
  };

  const features = [
    'Unlimited background removals',
    'HD downloads (up to 4K resolution)',
    'Batch processing (up to 10 images)',
    'Manual editing tools',
    'Premium background effects',
    'Priority processing speed',
    'No watermarks',
    '2 months of premium access'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Free Plan Limit Reached
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
            <Zap className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-700 mb-2">
              <strong>You've used all 3 free background removals!</strong>
            </p>
            <p className="text-xs text-gray-600">
              Upgrade to Premium for unlimited access and advanced features.
            </p>
          </div>

          <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-600">₹9</div>
            <div className="text-muted-foreground">for 2 months</div>
            <div className="text-xs text-gray-600 mt-1">Special Launch Offer!</div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Premium Features:</h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>🎉 Limited Time:</strong> Get 2 months of premium access for just ₹9! 
              That's unlimited background removals and all premium features.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Maybe Later
            </Button>
            <Button
              onClick={handleUpgrade}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Secure upgrade • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanLimitModal;