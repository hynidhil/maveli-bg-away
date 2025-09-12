import React from 'react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Crown, Check, X, Sparkles, Zap, Key, Mail } from 'lucide-react';
import { upgradeToPremium, activateWithCode } from '@/utils/planManager';
import { toast } from '@/components/ui/sonner';

interface PlanLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

const PlanLimitModal: React.FC<PlanLimitModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const [activationCode, setActivationCode] = useState('');
  const [showActivation, setShowActivation] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleUpgrade = () => {
    upgradeToPremium();
    onUpgrade?.();
    onClose();
    window.location.reload(); // Refresh to update plan status
  };

  const handleActivation = async () => {
    if (!activationCode.trim()) {
      toast.error('Please enter an activation code');
      return;
    }
    
    setIsActivating(true);
    
    try {
      const success = activateWithCode(activationCode);
      
      if (success) {
        toast.success('Premium activated successfully! 🎉');
        onUpgrade?.();
        onClose();
        window.location.reload();
      } else {
        toast.error('Invalid or already used activation code');
      }
    } catch (error) {
      toast.error('Failed to activate code');
    } finally {
      setIsActivating(false);
    }
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
              Upgrade to Premium or use an activation code for unlimited access.
            </p>
          </div>

          {!showActivation ? (
            <>
              <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600">₹49</div>
                <div className="text-muted-foreground">for 1 month</div>
                <div className="text-xs text-gray-600 mt-1">Premium Access!</div>
              </div>

              <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <Key className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Have an activation code?</strong>
                </p>
                <Button
                  onClick={() => setShowActivation(true)}
                  variant="outline"
                  className="border-blue-500 text-blue-500 hover:bg-blue-50"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Enter Activation Code
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <Key className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-700 mb-4">
                  <strong>Enter your activation code</strong>
                </p>
                <Input
                  placeholder="Enter activation code (e.g., PLM8Q2)"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                  className="text-center font-mono text-lg"
                  maxLength={6}
                />
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-800 font-medium">
                    Need an activation code?
                  </p>
                </div>
                <p className="text-sm text-green-700">
                  Contact us at: <strong>hynidhil@gmail.com</strong>
                </p>
              </div>
            </div>
          )}

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

          {!showActivation ? (
            <>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>🎉 Premium Access:</strong> Get 1 month of premium access for ₹49! 
                  Unlimited background removals and all premium features.
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
            </>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={() => setShowActivation(false)}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleActivation}
                disabled={isActivating || !activationCode.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <Key className="w-4 h-4 mr-2" />
                {isActivating ? 'Activating...' : 'Activate'}
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            {showActivation ? 'Each activation code can only be used once' : 'Secure upgrade • Cancel anytime • 30-day money-back guarantee'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanLimitModal;