
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Apple, Facebook } from 'lucide-react';

interface SocialLoginButtonsProps {
  redirectUrl?: string;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ redirectUrl = '/dashboard' }) => {
  const { toast } = useToast();

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}${redirectUrl}`
        }
      });
    } catch (err: any) {
      console.error(`Erro ao entrar com ${provider}:`, err);
      toast({
        title: `Erro ao entrar com ${provider}`,
        description: err.message || `Não foi possível entrar com ${provider}. Tente novamente.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex justify-center gap-6 mb-4">
      <button 
        className="social-button"
        onClick={() => handleSocialLogin('google')}
        aria-label="Continuar com Google"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
          />
        </svg>
      </button>
      <button 
        className="social-button"
        onClick={() => handleSocialLogin('facebook')}
        aria-label="Continuar com Facebook"
      >
        <Facebook size={20} />
      </button>
      <button 
        className="social-button"
        onClick={() => handleSocialLogin('apple')}
        aria-label="Continuar com Apple"
      >
        <Apple size={20} />
      </button>
    </div>
  );
};

export default SocialLoginButtons;
