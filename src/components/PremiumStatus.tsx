
import React from 'react';
import { Crown, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PremiumStatus: React.FC = () => {
  const isPremium = localStorage.getItem('isPremium') === 'true';
  const premiumExpiry = localStorage.getItem('premiumExpiry');
  
  if (!isPremium) return null;

  const expiryDate = premiumExpiry ? new Date(premiumExpiry) : null;
  const daysLeft = expiryDate ? Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  const handleLogout = () => {
    localStorage.removeItem('isPremium');
    localStorage.removeItem('premiumExpiry');
    localStorage.removeItem('paymentId');
    window.location.reload();
  };

  return (
    <div className="fixed top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-2 mb-2">
        <Crown className="w-5 h-5" />
        <span className="font-semibold">Premium Active</span>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <Calendar className="w-4 h-4" />
        <span>{daysLeft} days left</span>
      </div>
      <Button
        onClick={handleLogout}
        variant="ghost"
        size="sm"
        className="mt-2 text-white hover:bg-white/20 text-xs"
      >
        Reset Premium
      </Button>
    </div>
  );
};

export default PremiumStatus;
