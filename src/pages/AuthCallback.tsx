import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { setUserAuthenticated } from '@/utils/planManager';
import { toast } from '@/components/ui/sonner';
import { Loader } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed');
          navigate('/');
          return;
        }

        if (data.session) {
          // User is authenticated
          setUserAuthenticated(true);
          toast.success('Successfully signed in with Google!');
          navigate('/');
        } else {
          // No session found
          toast.error('Authentication failed');
          navigate('/');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed');
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-8 h-8 animate-spin text-green-500 mx-auto mb-4" />
        <p className="text-white text-lg">Completing authentication...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we sign you in</p>
      </div>
    </div>
  );
};

export default AuthCallback;