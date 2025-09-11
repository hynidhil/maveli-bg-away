
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, X, Sparkles } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);

    // Check if Razorpay is loaded
    if (typeof window.Razorpay === 'undefined') {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => initializePayment();
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        setIsProcessing(false);
      };
      document.body.appendChild(script);
    } else {
      initializePayment();
    }
  };

  const initializePayment = () => {
    const options = {
      key: 'rzp_test_9999999999', // Replace with your Razorpay key
      amount: 900, // ₹9 in paise
      currency: 'INR',
      name: 'ClearPix Premium',
      description: '2 Month Premium Access',
      image: '/favicon.ico',
      handler: function (response: any) {
        console.log('Payment successful:', response);
        // Store premium status
        localStorage.setItem('isPremium', 'true');
        localStorage.setItem('premiumExpiry', new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()); // 2 months
        localStorage.setItem('paymentId', response.razorpay_payment_id);
        
        setIsProcessing(false);
        onClose();
        
        // Show success message and reload to update premium status
        alert('Payment successful! You now have premium access for 2 months.');
        window.location.reload();
      },
      prefill: {
        name: 'User',
        email: 'user@example.com',
      },
      theme: {
        color: '#10b981',
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const features = [
    'HD downloads (up to 4K resolution)',
    'Remove watermarks completely',
    'Full access to manual brush tool',
    'Premium background effects',
    'Priority processing speed',
    '2 months of premium access'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Premium Feature 🔒
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-gray-700 mb-2">
              <strong>Upgrade for HD download & watermark-free images!</strong>
            </p>
            <div className="text-3xl font-bold text-green-600">₹9</div>
            <div className="text-muted-foreground">for 2 months</div>
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
              <strong>Special Offer:</strong> Get 2 months of premium access for just ₹9! 
              Unlock HD downloads and remove watermarks from all your images.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Upgrade Now'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Secure payment powered by Razorpay. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
