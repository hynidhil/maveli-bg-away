import React, { useState } from 'react';
import { Menu, X, Zap, Shield, Star, User, LogOut, Crown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { isUserAuthenticated, getUserPlan, resetPlan } from '@/utils/planManager';
import AuthModal from './AuthModal';
import PlanLimitModal from './PlanLimitModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  
  const isAuthenticated = isUserAuthenticated();
  const userPlan = getUserPlan();
  
  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    resetPlan();
    window.location.reload();
  };

  return (
    <>
      <header className="w-full py-4 px-4 bg-black/95 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                ClearPix
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {!isAuthenticated ? (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                      {userPlan.type === 'premium' && (
                        <Crown className="w-4 h-4 ml-2 text-yellow-500" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <div>
                        <p className="font-medium">Account</p>
                        <p className="text-sm text-muted-foreground">
                          {userPlan.type === 'premium' ? 'Premium User' : 'Free User'}
                        </p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {userPlan.type === 'free' && (
                      <DropdownMenuItem onClick={() => setShowPlanModal(true)}>
                        <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                        Upgrade to Pro
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
              {!isAuthenticated ? (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              ) : (
                <div className="mt-4 space-y-2">
                  <p className="text-white">Welcome back!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
      
      <PlanLimitModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
      />
    </>
  );
};

export default Header;